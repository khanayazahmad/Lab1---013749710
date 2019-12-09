

const graphql = require('graphql');
const { UserSchema } = require('../schemas/user');
const userService = require('../../../../grubhub/service_v2/users');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

function getPromise(id){
    return new Promise((resolve, reject) => {
        return userService.getById(id, function(err, user){
            if(err) return reject(err);
            console.log(user);
            return resolve(user);
        });
    })
}

const getUser = {
    type: UserSchema,
    args: {
        id: {
            type: GraphQLID
        }
    },
    resolve(parent, args){
        return getPromise(args.id);
    }
}

module.exports = { getUser };


