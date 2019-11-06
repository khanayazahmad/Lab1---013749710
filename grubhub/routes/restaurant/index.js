const restaurantService = require('../../service_v2/restaurant');
const _ = require('lodash');

module.exports.createRestaurant = function(request, response){
    if(!(request.body && request.body.name && request.body.cuisine  && request.body.zip && request.body.userId)){
        return response.status(400).send("INVALID REQUEST");
    }
    restaurantService.create(request.body, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: data
        });

    });
}

module.exports.getRestaurant = function(request, response){
    if(!(request.params && request.params.restaurantId)){
        return response.status(400).send("INVALID REQUEST");
    }
    restaurantService.getById(request.params.restaurantId, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: data
        });

    });
}

module.exports.getRestaurantByOwner = function(request, response){
    if(!(request.params && request.params.ownerId)){
        return response.status(400).send("INVALID REQUEST");
    }
    restaurantService.getByOwnerId(request.params.ownerId, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            restaurant: data
        });

    });
}

module.exports.getAllRestaurants= function(request, response){
    var pagination = {
        skip:0,
        limit:3
    };

    if(request.query.offset) pagination.skip = Number(request.query.offset);

    if(request.query.limit) pagination.limit = Number(request.query.limit);
    
    restaurantService.getAll(pagination, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            restaurants: data
        });

    });
}

module.exports.searchRestaurantsByFilter= function(request, response){
    if(!(request.body && request.body && (request.body.name || request.body.cuisine))){
        return response.status(400).send("INVALID REQUEST");
    }
    var pagination = {
        skip:0,
        limit:3
    };

    if(request.query.skip) pagination.skip = Number(request.query.skip);

    if(request.query.limit) pagination.limit = Number(request.query.limit);

    restaurantService.search(request.body, pagination, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            restaurants: data
        });

    });
}

module.exports.updateRestaurants = function(request, response){
    if(!(request.body && request.body.where && request.body.where.id && request.body.params)){
        return response.status(400).send("INVALID REQUEST");
    }
    restaurantService.update(request.body, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            restaurant: data
        });

    });
}

module.exports.deleteRestaurants = function(request, response){
    if(!(request.params && request.params.restaurantId)){
        return response.status(400).send("INVALID REQUEST");
    }
    restaurantService.delete(request.params.restaurantId, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: data
        });

    });
}