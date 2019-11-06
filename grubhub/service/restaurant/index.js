const repository = require('../../repository');
const menuService = require('../menu');
const _ = require('lodash');
const async = require('async');
const fuzz = require('fuzzball');

module.exports.create = function(newRestaurant, cb){
    repository.Restaurant.create({
        name: newRestaurant.name,
        cuisine: newRestaurant.cuisine,
        zip: newRestaurant.zip,
        userId: newRestaurant.userId,
        data: newRestaurant.data?newRestaurant.data:null
    }).then(function(restaurant){

        return cb(null, restaurant);
        
    },function(err){
        return(err);
    });
}

module.exports.getById = function(restaurantId, cb){
    repository.Restaurant.findOne({
        where:{
            id: restaurantId
        }
    }).then(function(restaurant){

        return cb(null,{
            id:restaurant.id,
            name:restaurant.name,
            cuisine:restaurant.cuisine,
            zip:restaurant.zip,
            data:restaurant.data,
            userId:restaurant.userId              
        })
    },function(err){
        return cb(err);
    });
}

module.exports.getByOwnerId = function(ownerId, cb){
    repository.Restaurant.findOne({
        where:{
            userId:ownerId
        }
    }).then(function(restaurant){
        if(restaurant){

                return cb(null,{
                    id:restaurant.id,
                    name:restaurant.name,
                    cuisine:restaurant.cuisine,
                    zip:restaurant.zip,
                    data:restaurant.data,
                    userId:restaurant.userId              
                })

        }

        return cb(null, null);
    },function(err){
        return cb(err);
    });
}

module.exports.getAll= function(cb){
    repository.Restaurant.findAll({
        where:{
        }
    }).then(function(restaurants){

        restaurants=restaurants.map(restaurant => ({
            id:restaurant.id,
            name:restaurant.name,
            cuisine:restaurant.cuisine,
            zip:restaurant.zip,
            data:restaurant.data         
        }) )

        return cb(null, restaurants);
    },function(err){
        return cb(err);
    });
}

module.exports.search = function(filters, cb){

    const where = {};

    var filteredSearchResults = [];

        repository.Restaurant.findAll({
            where:where
        }).then(function(restaurants){
            if(!(restaurants && _.isArray(restaurants) && restaurants.length > 0)){
                return cb();
            }

            restaurants=restaurants.map(restaurant => ({
                id:restaurant.id,
                name:restaurant.name,
                cuisine:restaurant.cuisine,
                zip:restaurant.zip,
                data:restaurant.data         
            }) )
            

            if(filters.name == ''){
                return cb(null, restaurants);
            }
            

            filteredSearchResults = restaurants.filter(res => res.name.trim().toLowerCase().includes(filters.name.trim().toLowerCase()));

            return menuService.getByRestaurantIds(restaurants.map(res=>res.id), function(err, menus){
                filteredSearchResults = filteredSearchResults.concat(restaurants.filter(res => {
                    let menu = menus.filter(menu => menu.restaurantId === res.id);
                    menu = menu.length > 0? menu[0]:null;
                    if(menu && menu.items && _.isArray(menu.items) && menu.items.length>0){
                        return menu.items.filter(res => res.name.trim().toLowerCase().includes(filters.name.trim().toLowerCase())).length;
                    }
                    return false;
                }));
                return cb(null, filteredSearchResults);
            })


            return cb();
        }, function(err){
            return cb(err);
        });

}

module.exports.update = function(updateParams, cb){

    repository.Restaurant.update(updateParams.params, {
        where: updateParams.where
    }).then(function(restaurant){
        return module.exports.getById(updateParams.where.id, cb);
    });
}

module.exports.delete = function(restaurantId, cb){

    repository.Restaurant.destroy(
        {
          where: {
            restaurantId:restaurantId
          }
        }).then(function () {
          return cb(null, {
              message : "RESTAURANT DELETED SUCCESSFULLY"
          });
    
        }, function (err) {
          return cb(err, null);
    
        });

}