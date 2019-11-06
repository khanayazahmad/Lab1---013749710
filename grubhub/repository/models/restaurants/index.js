module.exports = function (sequelize, DataTypes) {
	return sequelize.define('restaurant', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(500),
			allowNull: false,
			validate: {
				notEmpty: true
			},
			unique:true
		},
		cuisine: {
			type: DataTypes.ENUM('INDIAN', 'FASTFOOD','ASIAN','MEXICAN','ITALIAN','THAI','CHINESE'),
			allowNull: false
		},
        zip: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		data: {
	        type: DataTypes.JSON,
	        allowNull: true
	    }
	});
};
