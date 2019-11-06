const orderService = require('../../service_v2/order');
const _ = require('lodash');
const kafka = require('../../kafka/client');

module.exports.createOrder = function(request, response){
    if(!(request.body && request.body && request.body.userId && request.body.restaurantId 
        && request.body.deliveryAddress && request.body.data )){
        return response.status(400).send("INVALID REQUEST");
    }

    kafka.make_request('order',{
        task:'createOrder',
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
                order: data
            });
    
        });
}

module.exports.getOrder = function(request, response){
    if(!(request.params && request.params.orderId)){
        return response.status(400).send("INVALID REQUEST");
    }
    kafka.make_request('order',{
        task:'getOrder',
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
            order: data
        });

    });
}

module.exports.getOrdersByRestaurantId= function(request, response){
    if(!(request.params && request.params.restaurantId)){
        return response.status(400).send("INVALID REQUEST");
    }
    kafka.make_request('order',{
        task:'getOrdersByRestaurantId',
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
            orders: data
        });

    });
}

module.exports.getOrdersByUserId= function(request, response){
    if(!(request.params && request.params.userId)){
        return response.status(400).send("INVALID REQUEST");
    }
    kafka.make_request('order',{
        task:'getOrdersByUserId',
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
            orders: data
        });

    });
}

module.exports.updateOrderStatus = function(request, response){
    if(!(request.body && request.params.orderId && request.body.status)){
        return response.status(400).send("INVALID REQUEST");
    }
    kafka.make_request('order',{
        task:'updateOrderStatus',
        payload:{
            params:request.params,
            body:request.body,
            query:request.query
        }
    },function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            orders: data
        });

    });
}

module.exports.cancelOrders = function(request, response){
    if(!(request.params && request.params.orderId && request.body.userId)){
        return response.status(400).send("INVALID REQUEST");
    }
    kafka.make_request('order',{
        task:'cancelOrders',
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
            orders: data
        });

    });
}


module.exports.getCartByUserId = function(request, response){
    if(!(request.params.userId)){
        return response.status(400).send("INVALID REQUEST");
    }

    kafka.make_request('order',{
        task:'getCartByUserId',
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
            cart: data
        });
    })
}

module.exports.updateCart = function(request, response){
    if(!(request.body.id && request.body.data && request.body.total)){

        if(request.body.total == 0){
            return orderService.updateCart(request.body, function(err, data){
                if (err){
                    return response.status(err.code ? err.code : 500).send(err);
                }
                return response.send({
                    status: "ok",
                    cart: data
                });
            });
        }
        return response.status(400).send("INVALID REQUEST");
    }

    return orderService.updateCart(request.body, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            cart: data
        });
    })
}

module.exports.addToCart = function(request, response){
    if(!(request.body.userId && request.body.item && request.body.restaurantId && request.body.quantity)){
        return response.status(400).send("INVALID REQUEST");
    }

    kafka.make_request('order',{
        task:'addToCart',
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
            cart: data
        });
    })
}
