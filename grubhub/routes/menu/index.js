const menuService = require('../../service/menu');
const _ = require('lodash');
const async = require('async');

function validateMenuItems(items, cb){
    var end_results = [];
    async.forEachOfSeries(items, function(item, idx, icb){
        if(item && item.category && item.image && item.name && item.price){
            return con.inner_query(str, function(err, result){
                if(err){
                    return icb(err);
                }
                end_results.push(result);
                return icb();
            })
            
        }else{
            return icb(`Item: ${JSON.stringify(item)} is missing fields`);
        }
    }, function(err){
        if(err){
            return cb(err);
        }

        return cb(null, end_results);
    });
}

module.exports.createMenu = function(request, response){
    if(!(request.body && request.params.restaurantId )){
        return response.status(400).send("INVALID REQUEST");
    }



        return menuService.create(request.params.restaurantId, function(err, data){
            if (err){
                return response.status(err.code ? err.code : 500).send(err);
            }
            return response.send({
                status: "ok",
                menu: data
            });
    
        });

    
}

module.exports.getMenu = function(request, response){
    if(!(request.params && request.params.menuId)){
        return response.status(400).send("INVALID REQUEST");
    }
    menuService.getById(request.params.menuId, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: data
        });

    });
}

module.exports.getMenuByRestaurantId = function(request, response){
    if(!(request.params && request.params.restaurantId)){
        return response.status(400).send("INVALID REQUEST");
    }
    return menuService.getByRestaurantId(request.params.restaurantId, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            menu: data
        });

    });
}

module.exports.addItem = function(request, response){
    if(!(request.body && request.body.menuId && request.body.category && request.body.name && request.body.price )){
        return response.status(400).send("INVALID REQUEST");
    }

        return menuService.addItem(request.body, function(err, data){
            if (err){
                return response.status(err.code ? err.code : 500).send(err);
            }
            return response.send({
                status: "ok",
                menu: data
            });
    
        });



}

module.exports.updateItem = function(request, response){
    if(!(request.body && request.body.where && request.body.where.id && request.body.where.menuId && request.body.params)){
        return response.status(400).send("INVALID REQUEST");
    }
    menuService.update(request.body, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            menu: data
        });

    });
}

module.exports.deleteItem = function(request, response){
    if(!(request.params && request.params.itemId)){
        return response.status(400).send("INVALID REQUEST");
    }
    menuService.delete(request.params.itemId, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            menu: data
        });

    });
}