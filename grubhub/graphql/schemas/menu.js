const graphql = require('graphql');
const { GraphQLJSONObject }  = require('graphql-type-json');
const menuService = require('../../../../grubhub/service_v2/menu');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    Graph
} = graphql;


const MenuSchema = new GraphQLObjectType({
    name: 'Menu',
    fields: ( ) => ({
        id: { type: GraphQLID },
        items:{
            type: new GraphQLList(ItemSchema),
            resolve(parent, args){
                return menuService.getItems(parent.id);
            }
        }
    })
});

const ItemSchema = new GraphQLObjectType({
    name: 'Item',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        image: { type: GraphQLString },
        price: { type: graphql.GraphQLFloat },
        data: { type: GraphQLJSONObject },
        menuId: { type: GraphQLID },
    })
});

module.exports = { ItemSchema, MenuSchema };