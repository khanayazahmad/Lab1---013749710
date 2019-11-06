const Schema = require('mongoose').Schema;

const OrderSchema = new Schema({
	status: {
		type: String,
		enum: [
			'NEW',
			'PREPARING',
			'READY',
			'DELIVERED',
			'CANCELLED'
		],
		required: true,
		default: 'NEW'
	},
	total: {
		type: Number,
		required: true
	},
	deliveryAddress: {
		type: Schema.Types.Mixed,
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

module.exports = OrderSchema;

