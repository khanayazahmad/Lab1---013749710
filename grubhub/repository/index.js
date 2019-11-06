const Sequelize       = require('sequelize');
const UserModel       = require('./models/users');
const ItemModel       = require('./models/items');
const MenuModel       = require('./models/menu');
const OrderModel      = require('./models/orders');
const RestaurantModel = require('./models/restaurants');
const CartModel       = require('./models/cart');

  const Op = Sequelize.Op;
	const operatorsAliases = {
	    $eq: Op.eq,
	    $ne: Op.ne,
	    $gte: Op.gte,
	    $gt: Op.gt,
	    $lte: Op.lte,
	    $lt: Op.lt,
	    $not: Op.not,
	    $in: Op.in,
	    $notIn: Op.notIn,
	    $is: Op.is,
	    $like: Op.like,
	    $notLike: Op.notLike,
	    $iLike: Op.iLike,
	    $notILike: Op.notILike,
	    $regexp: Op.regexp,
	    $notRegexp: Op.notRegexp,
	    $iRegexp: Op.iRegexp,
	    $notIRegexp: Op.notIRegexp,
	    $between: Op.between,
	    $notBetween: Op.notBetween,
	    $overlap: Op.overlap,
	    $contains: Op.contains,
	    $contained: Op.contained,
	    $adjacent: Op.adjacent,
	    $strictLeft: Op.strictLeft,
	    $strictRight: Op.strictRight,
	    $noExtendRight: Op.noExtendRight,
	    $noExtendLeft: Op.noExtendLeft,
	    $and: Op.and,
	    $or: Op.or,
	    $any: Op.any,
	    $all: Op.all,
	    $values: Op.values,
	    $col: Op.col
	};

const sequelize = new Sequelize('grubhub', 'admin', 'welcomegrubhub', {
  host: 'cmpe273.czohryfydiej.us-west-1.rds.amazonaws.com',
  dialect: 'mysql',
  port: '3306',
  operatorsAliases: operatorsAliases,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const User = UserModel(sequelize, Sequelize);
const Item = ItemModel(sequelize, Sequelize);
const Menu = MenuModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);
const Restaurant = RestaurantModel(sequelize, Sequelize);
const Cart = CartModel(sequelize, Sequelize);


Item.belongsTo(Menu);
Menu.hasMany(Item);

Restaurant.hasOne(Menu);
Menu.belongsTo(Restaurant);

User.hasMany(Order);
Restaurant.hasMany(Order);

Restaurant.belongsTo(User);

Cart.belongsTo(User);
Restaurant.hasMany(Cart);



sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  User,
  Restaurant,
  Menu,
  Item,
  Order,
  Cart,
  sequelize
}