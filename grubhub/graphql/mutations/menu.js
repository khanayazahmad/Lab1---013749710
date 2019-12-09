const graphql = require('graphql');
const { ItemSchema } = require('../schemas/menu');
const menuService = require('../../../../grubhub/service_v2/menu');
const { GraphQLJSONObject }  = require('graphql-type-json');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

function getRegisterPromise(item){
    return new Promise((resolve, reject) => {
        
            return menuService.addItem(item, function(err, data){
                if(err) return reject(err);
    
                return resolve(data);
            });

    });
}

const addItem = {
    type: ItemSchema,
    args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        category: {type: new GraphQLNonNull(GraphQLString)},
        image: {type: new GraphQLNonNull(GraphQLString)},
        price: {type: new GraphQLNonNull(graphql.GraphQLFloat)},
        menuId: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve(parent, args){
        return getRegisterPromise(args);
    }
}


module.exports = { addItem };


