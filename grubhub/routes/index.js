const express = require('express');
const router = express.Router();
//const auth = require('../auth')
const utils = require('../service/utils');
const User = require('../kafka-producer/user');
const Restaurant = require('../kafka-producer/restaurant');
const Menu = require('./menu');
const Order = require('../kafka-producer/order');
const Conv = require('./conversation');

var passport = require('passport');
var auth = {userAuth:passport.authenticate('jwt', {session: false})};
router.use(passport.initialize());
require('../auth/passport')(passport);

router.post('/img-upload', auth.userAuth, utils.uploadImage);

router.post('/user/register', User.register);

router.post('/user/login', User.login);

router.get('/user/get', auth.userAuth, User.get);

router.post('/user/update', auth.userAuth, User.update);

router.post('/restaurant/create', auth.userAuth, Restaurant.createRestaurant);

router.get('/restaurant/getByOwner/:ownerId', auth.userAuth, Restaurant.getRestaurantByOwner);

router.post('/restaurant/update', auth.userAuth, Restaurant.updateRestaurants);

router.post('/search', auth.userAuth, Restaurant.searchRestaurantsByFilter);

router.get('/restaurant/getAll', auth.userAuth, Restaurant.getAllRestaurants);

router.get('/menu/getByRestaurant/:restaurantId', auth.userAuth, Menu.getMenuByRestaurantId);

router.get('/menu/:menuId/getByCat/:category', auth.userAuth, Menu.getMenuByCat);

router.post('/menu/create/:restaurantId', auth.userAuth, Menu.createMenu);

router.post('/menu/addItem', auth.userAuth, Menu.addItem);

router.post('/menu/updateItem', auth.userAuth, Menu.updateItem);

router.delete('/menu/deleteItem/:itemId', auth.userAuth, Menu.deleteItem);

router.get('/cart/getByUser/:userId', auth.userAuth, Order.getCartByUserId);

router.post('/cart/addItem', auth.userAuth, Order.addToCart);

router.post('/cart/update', auth.userAuth, Order.updateCart);

router.post('/order/create', auth.userAuth, Order.createOrder);

router.post('/order/update/:orderId', auth.userAuth, Order.updateOrderStatus);

router.get('/order/getById/:orderId', auth.userAuth, Order.getOrder);

router.get('/order/getByRestaurant/:restaurantId', auth.userAuth, Order.getOrdersByRestaurantId);

router.get('/order/getByUser/:userId', auth.userAuth, Order.getOrdersByUserId);

router.post('/order/cancel/:orderId', auth.userAuth, Order.cancelOrders);

router.get('/chat/:channel', Conv.get);

module.exports = router;