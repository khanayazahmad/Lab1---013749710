const repository = require('../../repository');
const _ = require('lodash');
const async = require('async');
const userService = require('../users');

const resService = require('../restaurant');

module.exports.create = function (newOrder, cb) {

    repository.Order.create({
        userId: newOrder.userId,
        restaurantId: newOrder.restaurantId,
        status: 'NEW',
        total: newOrder.total,
        data: newOrder.data,
        deliveryAddress: newOrder.deliveryAddress
    }).then(function (order) {
        return cb(null, {
            id:order.id,
            userId: order.userId,
        restaurantId: order.restaurantId,
        status: order.status,
        total: order.total,
        data: order.data,
        deliveryAddress: order.deliveryAddress
        });

    }, function (err) {
        return (err);
    });
}

module.exports.getById = function (orderId, cb) {
    repository.Order.findOne({
        where: {
            id: orderId
        }
    }).then(function (order) {
        return cb(null, {
            id:order.id,
            userId: order.userId,
        restaurantId: order.restaurantId,
        status: order.status,
        total: order.total,
        data: order.data,
        deliveryAddress: order.deliveryAddress
        });

    }, function (err) {
        return cb(err);
    });
}

module.exports.getByRestaurantId = function (restaurantId, cb) {

    repository.Order.findAll({
        where: {
            restaurantId: restaurantId
        }
    }).then(function (orders) {

        return cb(null, orders.map(order=>({
            id:order.id,
            userId: order.userId,
        restaurantId: order.restaurantId,
        status: order.status,
        total: order.total,
        data: order.data,
        deliveryAddress: order.deliveryAddress,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt
        })));

    }, function (err) {
        return cb(err);
    });
}

module.exports.getByUserId = function (userId, cb) {

    repository.Order.findAll({
        where: {
            userId: userId
        }
    }).then(function (orders) {
        return cb(null, orders.map(order=>({
            id:order.id,
            userId: order.userId,
        restaurantId: order.restaurantId,
        status: order.status,
        total: order.total,
        data: order.data,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
        })));

    }, function (err) {
        return cb(err);
    });
}

module.exports.updateStatus = function (updateParams, cb) {

    repository.Order.update({
        status: updateParams.body.status
    }, {
        where: {
            id: updateParams.orderId
        }
    }).then(function (orders) {

            return module.exports.getByRestaurantId(updateParams.body.restaurantId, cb);
        
    });
}

module.exports.cancel = function (orderId, userId, cb) {
    repository.Order.update({
        status: 'CANCELLED'
    }, {
        where: {
            id: orderId
        }
    }).then(function (orders) {
        if (!orders) {
            return cb(null, { message: "No restaurant updated" });
        }
        return module.exports.getByUserId(userId, cb);
    });
}

module.exports.getCartByUserId = function(userId,cb){
    repository.Cart.findOne({
        where:{
            userId
        }
    }).then(function(cart){
        if(cart){
            return cb(null, {
                id:cart.id,
                userId: cart.userId,
                restaurantId: cart.restaurantId,
                data: cart.data,
                total: cart.total
            })
        }
        return cb(null, null);
    })
}

module.exports.getCartById = function(id,cb){
    repository.Cart.findOne({
        where:{
            id
        }
    }).then(function(cart){
        if(cart){
            return cb(null, {
                id:cart.id,
                userId: cart.userId,
                restaurantId: cart.restaurantId,
                data: cart.data,
                total: cart.total
            })
        }
        return cb(null, null);
    })
}


module.exports.addToCart = function (element, cb) {

    var item = element.item
    repository.Cart.findOne({
        where: {
            userId: element.userId
        }
    }).then(function (cart) {
        if (!cart) {
            var newCart = {
                userId: element.userId,
                restaurantId: element.restaurantId,
                data: {
                    items: [
                        {
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: element.quantity

                        }
                    ]
                },
                total: item.price * element.quantity
            }

            repository.Cart.create(newCart).then(function (cart0) {
                if (cart0) {
                    return cb(null, 'SUCCESS');
                }
                return cb(null, null);
            })
        } else {
            if (cart.restaurantId != element.restaurantId) {
                cart.data.items = []
            }

            if(cart.data.items.filter(item => item.id == element.item.id).length){
                cart.data.items.map(item => {
                    if(item.id == element.item.id){
                        //price updation todo 
                        item.quantity += element.quantity;
                        cart.total += element.quantity * element.item.price;
                    }
                    return item;
                });
            }else{

                cart.data.items.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: element.quantity
                });
                cart.total = cart.total + (item.price*element.quantity);

            }

            

            repository.Cart.update({
                restaurantId:element.restaurantId,
                data:cart.data,
                total:cart.total
            },{
                where: {
                    id:cart.id
                }
            }).then(function(cart1){
                if(cart1){
                    return cb(null, 'SUCCESS');
                }
                return cb(null, null);
            })
        }
    });


}

module.exports.updateCart = function(cart0, cb){
    repository.Cart.update({
        data:cart0.data,
        total:cart0.total
    },{
        where:{
            id:cart0.id
        }
    }).then(function(cart){
        if(cart){
           return module.exports.getCartById(cart0.id,cb);
        }
        return cb(null, null);
    });
}