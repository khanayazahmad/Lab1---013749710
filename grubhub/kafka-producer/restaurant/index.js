const restaurantService = require('../../service_v2/restaurant');
const _ = require('lodash');
const kafka = require('../../kafka/client');

module.exports.createRestaurant = function(request, response){
    if(!(request.body && request.body.name && request.body.cuisine  && request.body.zip && request.body.userId)){
        return response.status(400).send("INVALID REQUEST");
    }
    kafka.make_request('restaurant',{
        task:'createRestaurant',
        payload:{
            params:request.params,
            body:request.body,
            query:request.query
        }
    }, function(err, data){
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
    kafka.make_request('restaurant',{
        task:'getRestaurant',
        payload:{
            params:request.params,
            body:request.body,
            query:request.query
        }
    }, function(err, data){
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
    kafka.make_request('restaurant',{
        task:'getRestaurantByOwner',
        payload:{
            params:request.params,
            body:request.body,
            query:request.query
        }
    }, function(err, data){
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
    kafka.make_request('restaurant',{
        task:'getAllRestaurants',
        payload:{
            params:request.params,
            body:request.body,
            query:request.query
        }
    }, function(err, data){
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
    kafka.make_request('restaurant',{
        task:'searchRestaurantsByFilter',
        payload:{
            params:request.params,
            body:request.body,
            query:request.query
        }
    },  function(err, data){
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
    kafka.make_request('restaurant',{
        task:'updateRestaurants',
        payload:{
            params:request.params,
            body:request.body,
            query:request.query
        }
    }, function(err, data){
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
    kafka.make_request('restaurant',{
        task:'deleteRestaurants',
        payload:{
            params:request.params,
            body:request.body,
            query:request.query
        }
    },  function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: data
        });

    });
}