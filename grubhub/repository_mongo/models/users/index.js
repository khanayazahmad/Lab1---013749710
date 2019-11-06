const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,

	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['OWNER', 'BUYER'],
		default: 'BUYER'
	},
	data: {
		type: Schema.Types.Mixed
	}
}, {
	timestamps: true
});

UserSchema.path('name').validate(function (name) {
	return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
	return email.length;
}, 'Email cannot be blank');

module.exports = UserSchema;