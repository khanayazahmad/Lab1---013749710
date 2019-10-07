module.exports = function (sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		email: {
			type: DataTypes.STRING(1000),
			allowNull: false,
			validate: {
				notEmpty: true,

			},
			unique: true
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		role: {
			type: DataTypes.ENUM('OWNER', 'BUYER'),
			allowNull: false
		},
		data: {
	        type: DataTypes.JSON,
	        allowNull: true
	    }
	});
};

