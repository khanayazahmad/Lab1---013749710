const orderService = require('../../service_v2/order');
const _ = require('lodash');

function validateOrderItems(items, cb){
    async.forEachOfSeries(items, function(item, idx, icb){
        if(item && item.id && item.name && item.price && item.quantity && item.total){
            return icb();
        }else{
            return icb(`Item: ${JSON.stringify(item)} is missing fields`);
        }
    }, function(err){
        if(err){
            return cb(err);
        }

        return cb();
    });
}

module.exports.createOrder = function(request, response){
    if(!(request.body && request.body && request.body.userId && request.body.restaurantId 
        && request.body.deliveryAddress && request.body.data )){
        return response.status(400).send("INVALID REQUEST");
    }

        return orderService.create(request.body, function(err, data){
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
    orderService.getById(request.params.orderId, function(err, data){
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
    orderService.getByRestaurantId(request.params.restaurantId, function(err, data){
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
    orderService.getByUserId(request.params.userId, function(err, data){
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
    return orderService.updateStatus({orderId:request.params.orderId, body:request.body}, function(err, data){
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
    orderService.cancel(request.params.orderId, request.body.userId, function(err, data){
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

    return orderService.getCartByUserId(request.params.userId, function(err, data){
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

    return orderService.addToCart(request.body, function(err, data){
        if (err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            cart: data
        });
    })
}
