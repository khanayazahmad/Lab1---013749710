const restaurantService = require('../../../service_v2/restaurant');
const _ = require('lodash');

module.exports.createRestaurant = function(request, cb){
    return restaurantService.create(request.body, cb);
}

module.exports.getRestaurant = function(request, cb){
    return restaurantService.getById(request.params.restaurantId, cb);
}

module.exports.getRestaurantByOwner = function(request, cb){
    return restaurantService.getByOwnerId(request.params.ownerId, cb);
}

module.exports.getAllRestaurants= function(request, cb){
    var pagination = {
        skip:0,
        limit:3
    };

    if(request.query.offset) pagination.skip = Number(request.query.offset);

    if(request.query.limit) pagination.limit = Number(request.query.limit);
    
    return restaurantService.getAll(pagination, cb);
}

module.exports.searchRestaurantsByFilter= function(request, cb){

    var pagination = {
        skip:0,
        limit:3
    };

    if(request.query.skip) pagination.skip = Number(request.query.skip);

    if(request.query.limit) pagination.limit = Number(request.query.limit);

    return restaurantService.search(request.body, pagination, cb);
}

module.exports.updateRestaurants = function(request, cb){
    return restaurantService.update(request.body, cb);
}

module.exports.deleteRestaurants = function(request, cb){
    return restaurantService.delete(request.params.restaurantId, cb);
}