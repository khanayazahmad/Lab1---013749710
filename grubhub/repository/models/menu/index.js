module.exports = function (sequelize, DataTypes) {
	return sequelize.define('menu', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
        },
        data: {
	        type: DataTypes.JSON,
	        allowNull: true
	    }
	});
};
