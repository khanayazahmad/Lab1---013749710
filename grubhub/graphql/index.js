const graphql = require('graphql');
const UserQuery = require('./queries/user');
const UserMutation = require('./mutations/user');
const MenuMutation = require('./mutations/menu');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: UserQuery.getUser
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        registerUser: UserMutation.registerUser,
        updateUser: UserMutation.updateUser,
        addItem: MenuMutation.addItem
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
