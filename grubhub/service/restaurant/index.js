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
    if(filters.cuisine){
        where.cuisine = {
            $or: _.isArray(filters.cuisine)?filters.cuisine:[filters.cuisine]
        }
    }
    if(filters.zip){
        where.zip = {
            $or: _.isArray(filters.zip)?filters.zip:[filters.zip]
        }
    }

    const filteredSearchResults = [];

        repository.Restaurant.findAll({
            where:where
        }).then(function(restaurants){
            if(!(restaurants && _.isArray(restaurants) && restaurants.length > 0)){
                return cb();
            }
            let results = fuzz.extract(filters.name, restaurants.map(res=>res.name), {returnObjects: true})
                              .map(res => ({[res.choice]:res.score}));

            filteredSearchResults = filteredSearchResults.concat(restaurants.filter(res => results[res.name] > 60));

            menuService.getByRestaurantIds(restaurants.map(res=>res.id), function(err, menus){
                filteredSearchResults = filteredSearchResults.concat(restaurants.filter(res => {
                    let menu = menus.filter(menu => menu.restaurantId === res.id);
                    menu = menu.length > 0? menu[0]:null;
                    if(menu && menu.items && _.isArray(menu.items) && menu.items.length>0){
                        return fuzz.extract(filters.name, menu.items.map(res=>res.name?res.name:''))[0][2] > 80;
                    }
                    return false;
                }))
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