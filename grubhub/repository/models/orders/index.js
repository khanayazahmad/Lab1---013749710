module.exports = function(sequelize, DataTypes) {
    return sequelize.define('orders', {
	    id: { 
	        type: DataTypes.INTEGER,
	        allowNull: false,
	        autoIncrement: true,
                primaryKey: true
	    },
		status: {
	        type:DataTypes.ENUM(
				'NEW',
				'PREPARING',
				'READY',
				'DELIVERED',
				'CANCELLED'
			  ),
	        allowNull: false
		},
		total:{
			type: DataTypes.FLOAT,
			allowNull: false
		},
		deliveryAddress: {
			type: DataTypes.JSON,
	        allowNull: false 
		},
	    data: {
	        type: DataTypes.JSON,
	        allowNull: false 
	    }
	
    });
};
