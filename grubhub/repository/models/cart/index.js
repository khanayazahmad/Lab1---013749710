module.exports = function(sequelize, DataTypes) {
    return sequelize.define('cart', {
	    id: { 
	        type: DataTypes.INTEGER,
	        allowNull: false,
	        autoIncrement: true,
                primaryKey: true
	    },
		total:{
			type: DataTypes.FLOAT,
			allowNull: false
		},
	    data: {
	        type: DataTypes.JSON,
	        allowNull: false 
	    }
	
    });
};