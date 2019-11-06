const Schema = require('mongoose').Schema;

const conversationSchema = new Schema({
    channel: {
		type: String,
		unique: true,
		required: true,

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

module.exports = conversationSchema;

