const Schema = require('mongoose').Schema;

const MenuSchema = new Schema({
	data: {
		type: Schema.Types.Mixed,
		required: false
	},
	restaurantId: {
		type: Schema.Types.ObjectId,
		ref: 'restaurant'
	}
}, {
	timestamps: true
});

module.exports = MenuSchema;

