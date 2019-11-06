const Schema = require('mongoose').Schema;

const CartSchema = new Schema({
	total: {
		type: Number,
		required: true
	},
	data: {
		type: Schema.Types.Mixed,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	restaurantId: {
		type: Schema.Types.ObjectId,
		ref: 'restaurant'
	}
}, {
	timestamps: true
});

module.exports = CartSchema;
