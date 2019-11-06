const orderService = require('../../../service_v2/order');
const _ = require('lodash');


module.exports.createOrder = function(request, response){
    return orderService.create(request.body, response);
}

module.exports.getOrder = function(request, response){
    return orderService.getById(request.params.orderId, response);
}

module.exports.getOrdersByRestaurantId= function(request, response){
    return orderService.getByRestaurantId(request.params.restaurantId, response);
}

module.exports.getOrdersByUserId= function(request, response){
    return orderService.getByUserId(request.params.userId, response);
}

module.exports.updateOrderStatus = function(request, response){
    return orderService.updateStatus({orderId:request.params.orderId, body:request.body}, response);
}

module.exports.cancelOrders = function(request, response){
    return orderService.cancel(request.params.orderId, request.body.userId, response);
}


module.exports.getCartByUserId = function(request, response){
    return orderService.getCartByUserId(request.params.userId, response);
}

module.exports.addToCart = function(request, response){
    return orderService.addToCart(request.body, response)
}
