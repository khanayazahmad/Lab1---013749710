const repository = require('../../repository_mongo');
const _ = require('lodash');
const async = require('async');

function itemMapper(items) {
    if (items && _.isArray(items)) {
        return items.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            image: item.image,
            data: item.data,
            price: item.price,
            menuId: item.menuId
        }));
    }
    return {
        id: items.id,
        name: items.name,
        category: items.category,
        image: items.image,
        data: items.data,
        price: items.price,
        menuId: items.menuId
    };
}

module.exports.create = function (restaurantId, cb) {

    repository.Menu.create({
        restaurantId
    }).then(function (menu) {

        return cb(null, {
            id: menu.id,
            data: menu.data,
            restaurantId: menu.restaurantId,
            items: []
        });

    }, function (err) {
        return (err);
    });

}

module.exports.getById = function (menuId, cb) {

    repository.Menu.findById(menuId)
        .then(function (menu) {
            if (!(menu && menu.id)) {
                return cb(null, menu);
            }

            repository.Item.distinct('category', function(err, cats){
                if(err){
                    return cb(err);
                }
                var items = [];
                async.forEachOfSeries(cats,function(cat, idx, icb){
                    return repository.Item.find({
                        menuId: menu.id,
                        category:cat
                    },
                    null,
                    {
                        skip:0,
                        limit:3
                    }).then(function (res) {
                        if(res && _.isArray(res) && res.length > 0){
                            items = items.concat(res);
                        }
                        return icb()
                    }, function (err) {
                        return icb(err);
                    });
                }, function(err){
                    if(err){
                        return cb(err);
                    }
    
                    return cb(null, {
                        id: menu.id,
                        data: menu.data,
                        restaurantId: menu.restaurantId,
                        items: items && _.isArray(items) ? itemMapper(items) : []
                    });
    
                });
    
            });
        }, function (err) {
            return cb(err);
        });

}

// module.exports.getByRestaurantId = function (restaurantId, cb) {
//     repository.Menu.findOne({
//         restaurantId: restaurantId
//     }).then(function (menu) {
//         if (!(menu && menu.id)) {
//             return cb(null, menu);
//         }

//         repository.Item.find({
//             menuId: menu.id
//         }).then(function (items) {
//             return cb(null, {
//                 id: menu.id,
//                 data: menu.data,
//                 restaurantId: menu.restaurantId,
//                 items: items && _.isArray(items) ? itemMapper(items) : [] //check id
//             });
//         }, function (err) {
//             return cb(err);
//         });
//     }, function (err) {
//         return cb(err);
//     });
// }

module.exports.getByRestaurantId = function (restaurantId,  cb) {
    repository.Menu.findOne({
        restaurantId: restaurantId
    }).then(function (menu) {
        if (!(menu && menu.id)) {
            return cb(null, menu);
        }
        
        repository.Item.distinct('category', function(err, cats){
            if(err){
                return cb(err);
            }
            var items = [];
            async.forEachOfSeries(cats,function(cat, idx, icb){
                return repository.Item.find({
                    menuId: menu.id,
                    category:cat
                },
                null,
                {
                    skip:0,
                    limit:3
                }).then(function (res) {
                    if(res && _.isArray(res) && res.length > 0){
                        items = items.concat(res);
                    }
                    return icb()
                }, function (err) {
                    return icb(err);
                });
            }, function(err){
                if(err){
                    return cb(err);
                }

                return cb(null, {
                    id: menu.id,
                    data: menu.data,
                    restaurantId: menu.restaurantId,
                    items: items && _.isArray(items) ? itemMapper(items) : []
                });

            });

        });

       

    }, function (err) {
        return cb(err);
    });
}

module.exports.getByMenuIdByCat = function (menuId, cat, limit=3, offset=0,  cb) {

                return repository.Item.find({
                    menuId: menuId,
                    category:cat
                },
                null,
                {
                    skip:Number(offset),
                    limit:Number(limit)
                }).then(function (res) {
                    if(res && _.isArray(res) && res.length > 0){
                        return cb(null, itemMapper(res))
                    }
                    return cb(null, null)
                }, function (err) {
                    return cb(err);
                });
}

module.exports.getByRestaurantIds = function (restaurantIds, cb) {
    repository.Menu.find({
        restaurantId: {
            $or: restaurantIds
        }
    }).then(function (menus) {
        if (!(menus && _.isArray(menus) && menus.length > 0)) {
            return cb();
        }

        menus = menus.map(menu => ({
            id: menu.id,
            restaurantId: menu.restaurantId
        }))

        return repository.Item.find({
            menuId: {
                $or: menus.map(menu => menu.id)
            }
        }).then(function (items) {
            const results = [];
            return async.forEachOfSeries(menus, function (menu, idx, icb) {
                results.push({ ...menu, items: items.filter(item => item.menuId == menu.id).map(item => ({ name: item.name })) });
                return icb();
            }, function (err) {
                if (err) {
                    return cb(err);
                }

                return cb(null, results);
            })

        }, function (err) {
            return cb(err);
        });
    }, function (err) {
        return cb(err);
    });
}

module.exports.addItem = function (item, cb) {
    repository.Item.create({
        name: item.name,
        category: item.category.toUpperCase().trim(),
        price: _.isNumber(item.price) ? item.price : parseFloat(item.price),
        menuId: item.menuId,
        image: item.image,
        data: item.data
    }).then(function (iitem) {
        module.exports.getById(item.menuId, cb);
    }, function (err) {
        return cb(err);
    })
}

module.exports.update = function (updateParams, cb) {
    if(updateParams.where.id){
        updateParams.where._id = updateParams.where.id;
        delete updateParams.where.id;
    }
    repository.Item.updateOne(
        updateParams.where,
        updateParams.params).then(function (item) {
            return module.exports.getById(updateParams.where.menuId, cb);
        });

}

module.exports.delete = function (itemId, cb) {
    repository.Item.findById(itemId)
        .then(function (item) {
            repository.Item.remove({
                    id: itemId
                }).then(function () {

                    return module.exports.getById(item.menuId, cb);


                }, function (err) {
                    return cb(err, null);

                });
        }, function (err) {
            return cb(err);
        })

}

