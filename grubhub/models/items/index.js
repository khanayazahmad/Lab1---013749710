module.exports = function (sequelize, DataTypes) {
	return sequelize.define('items', {
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
        category: {
			type: DataTypes.ENUM('BREAKFAST','LUNCH','APPETIZER'),
			allowNull: false
		},
        image: {
			type: DataTypes.TEXT,
			allowNull: true
        },
		data: {
			type: DataTypes.JSON,
			allowNull: true
		},
        price: {
			type: DataTypes.FLOAT,
			allowNull: false
		}
	});
};
