const mongoose = require('mongoose');
const UserSchema = require('./models/users');
const RestaurantSchema = require('./models/restaurants');
const MenuSchema = require('./models/menu');
const ItemSchema = require('./models/items');
const CartSchema = require('./models/cart');
const OrderSchema = require('./models/orders');
const ConversationSchema = require('./models/conversation');

mongoose.connect("mongodb+srv://admin:welcome123@gh-cluster-z5n0j.mongodb.net/test?retryWrites=true&w=majority");

const userModel = mongoose.model('users', UserSchema);
const restaurantModel = mongoose.model('restaurant', RestaurantSchema);
const menuModel = mongoose.model('menu', MenuSchema);
const itemModel = mongoose.model('items', ItemSchema);
const cartModel = mongoose.model('cart', CartSchema);
const orderModel = mongoose.model('orders', OrderSchema);
const conversationModel = mongoose.model('conversation', ConversationSchema);

module.exports = {
    User: userModel,
    Restaurant: restaurantModel,
    Menu: menuModel,
    Item: itemModel,
    Cart: cartModel,
    Order: orderModel,
    Conversation: conversationModel,
    mongoose: mongoose
};