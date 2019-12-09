const graphql = require('graphql');
const { UserSchema } = require('../schemas/user');
const userService = require('../../service_v2/users');
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

function getRegisterPromise(newUser){
    return new Promise((resolve, reject) => {
        return userService.getByEmail(newUser.email, function(err, user){
            if(err)
                return reject(err);
            if(user){
                return reject("EMAIL ALREADY EXITS");
            }
    
            return userService.create(newUser, function(err, data){
                if(err) return reject(err);
    
                return resolve(data);
            });
        });
    })
}

function getUpdatePromise(newUser){
    return new Promise((resolve, reject) => {
        return userService.update(newUser, function(err, user){
                if(err) return reject(err);    
                return resolve(user);
            });
    })
}

const registerUser = {
    type: UserSchema,
    args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        role: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        data: {type: GraphQLJSONObject}
    },
    resolve(parent, args){
        return getRegisterPromise(args);
    }
}

const updateUser = {
    type: UserSchema,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve(parent, args){
        return getUpdatePromise(args);
    }
}

module.exports = { registerUser, updateUser };


