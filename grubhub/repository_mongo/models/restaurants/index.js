const Schema = require('mongoose').Schema;

const RestaurantSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	cuisine: {
		type: String,
		enum: ['INDIAN', 'FASTFOOD', 'ASIAN', 'MEXICAN', 'ITALIAN', 'THAI', 'CHINESE', 'MIXED'],
		required: true,
		default: 'MIXED'
	},
	zip: {
		type: Number,
		required: false
	},
	data: {
		type: Schema.Types.Mixed
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	}
}, {
	timestamps: true
});

module.exports = RestaurantSchema;
