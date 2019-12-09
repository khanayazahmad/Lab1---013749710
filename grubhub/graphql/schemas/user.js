const graphql = require('graphql');
const { GraphQLJSONObject }  = require('graphql-type-json');

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

const UserSchema = new GraphQLObjectType({
    name: 'User',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        role: { type: GraphQLString },
        data: { type: GraphQLJSONObject },
        cart: { type: GraphQLJSONObject },
    })
});

module.exports = { UserSchema };