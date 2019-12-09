

const graphql = require('graphql');
const { MenuSchema } = require('../schemas/menu');
const menuService = require('../../service_v2/menu');
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
        return menuService.getById(id, function(err, menu){
            if(err) return reject(err);
            console.log(user);
            return resolve(menu);
        });
    })
}

const getMenu = {
    type: MenuSchema,
    args: {
        id: {
            type: GraphQLID
        }
    },
    resolve(parent, args){
        return getPromise(args.id);
    }
}

module.exports = { getMenu };


