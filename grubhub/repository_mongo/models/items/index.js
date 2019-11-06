const Schema = require('mongoose').Schema;

const ItemSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	data: {
		type: Schema.Types.Mixed,
		required: false
	},
	price: {
		type: Number,
		required: true
	},
	menuId: {
		type: Schema.Types.ObjectId,
		ref: 'menu'
	}
}, {
	timestamps: true
});

module.exports = ItemSchema;