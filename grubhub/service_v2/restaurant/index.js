const repository = require('../../repository_mongo');
const menuService = require('../menu');
const _ = require('lodash');
const async = require('async');
const fuzz = require('fuzzball');

module.exports.create = function (newRestaurant, cb) {
    repository.Restaurant.create({
        name: newRestaurant.name,
        cuisine: newRestaurant.cuisine,
        zip: newRestaurant.zip,
        userId: newRestaurant.userId,
        data: newRestaurant.data ? newRestaurant.data : {}
    }).then(function (restaurant) {

        return cb(null, {
            id: restaurant.id,
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            zip: restaurant.zip,
            data: restaurant.data,
            userId: restaurant.userId
        });

    }, function (err) {
        return cb(err);
    });
}

module.exports.getById = function (restaurantId, cb) {
    repository.Restaurant.findById(restaurantId)
        .then(function (restaurant) {

            return cb(null, {
                id: restaurant.id,
                name: restaurant.name,
                cuisine: restaurant.cuisine,
                zip: restaurant.zip,
                data: restaurant.data,
                userId: restaurant.userId
            })
        }, function (err) {
            return cb(err);
        });
}

module.exports.getByOwnerId = function (ownerId, cb) {
    repository.Restaurant.findOne({
        userId: ownerId
    }).then(function (restaurant) {
        if (restaurant) {

            return cb(null, {
                id: restaurant.id,
                name: restaurant.name,
                cuisine: restaurant.cuisine,
                zip: restaurant.zip,
                data: restaurant.data,
                userId: restaurant.userId
            })

        }

        return cb(null, null);
    }, function (err) {
        return cb(err);
    });
}

module.exports.getAll = function (pagination, cb) {
    repository.Restaurant.find(null, null, pagination)
        .then(function (restaurants) {
            if (!(restaurants && _.isArray(restaurants) && restaurants.length > 0)) {
                return cb();
            }
            restaurants = restaurants.map(restaurant => ({
                id: restaurant.id,
                name: restaurant.name,
                cuisine: restaurant.cuisine,
                zip: restaurant.zip,
                data: restaurant.data,
                userId: restaurant.userId
            }))

            return cb(null, restaurants);
        }, function (err) {
            return cb(err);
        });
}

module.exports.search = function (filters, pg, cb) {

    const where = {};

    var filteredSearchResults = [];

    repository.Restaurant.find().then(function (restaurants) {
        if (!(restaurants && _.isArray(restaurants) && restaurants.length > 0)) {
            return cb();
        }

        restaurants = restaurants.map(restaurant => ({
            id: restaurant.id,
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            zip: restaurant.zip,
            data: restaurant.data,
            userId: restaurant.userId
        }))


        if (filters.name == '') {
            return cb(null, restaurants);
        }


        filteredSearchResults = restaurants.filter(res => res.name.trim().toLowerCase().includes(filters.name.trim().toLowerCase()));

        return menuService.getByRestaurantIds(restaurants.map(res => res.id), function (err, menus) {
            filteredSearchResults = filteredSearchResults.concat(restaurants.filter(res => {
                let menu = menus.filter(menu => menu.restaurantId === res.id);
                menu = menu.length > 0 ? menu[0] : null;
                if (menu && menu.items && _.isArray(menu.items) && menu.items.length > 0) {
                    return menu.items.filter(res => res.name.trim().toLowerCase().includes(filters.name.trim().toLowerCase())).length;
                }
                return false;
            }));
            return cb(null, filteredSearchResults);
        });
    }, function (err) {
        return cb(err);
    });

}

//check
module.exports.update = function (updateParams, cb) {
    if(updateParams.where.id){
        updateParams.where._id = updateParams.where.id;
        delete updateParams.where.id;
    }
    repository.Restaurant.updateOne(updateParams.where, updateParams.params)
        .then(function (restaurant) {
            return module.exports.getById(updateParams.where.id, cb);
        });
}

module.exports.delete = function (restaurantId, cb) {

    repository.Restaurant.remove({
        id: restaurantId
    }).then(function (data) {
        return cb(null, {
            message: "RESTAURANT DELETED SUCCESSFULLY"
        });

    }, function (err) {
        return cb(err, null);

    });

}