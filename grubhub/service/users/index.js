const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repository = require('../../repository');
const orderService = require('../order')

module.exports.create = function(newUser, cb){
    return bcrypt.genSalt(10, (err, salt)=>{
        if(err) return cb(err);

        return bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) return cb(err);

            newUser.password = hash;
            return repository.User.create({
                name:newUser.name,
                email:newUser.email,
                password:newUser.password,
                role:newUser.role,
                data:newUser.data?newUser.data:null
            }).then(function(user){

                return cb(null,{message:"USER SUCCESSFULLY REGISTERED"});
                
            },function(err){
                return cb(err);
            });

        });
    })
}

module.exports.update = function(newUser, cb){

            return repository.User.update({
                name:newUser.name,
                email:newUser.email,
                data:newUser.data?newUser.data:null
            }, {where:{
                id: newUser.id
            }}).then(function(user){

                return module.exports.getById(newUser.id,cb);
                
            },function(err){
                return cb(err);
            });



}

module.exports.verifyAndAssignToken =  function(credentials, user, cb){
    bcrypt.compare(
        credentials,
        user.password)
            .then(match => {
                if(!match){
                    return cb({
                        code: 401,
                        message: 'INVALID CREDENTIALS'
                    })
                }
                const tokenParams = {
                    id: user.id,
                    name: user.name,
                    role: user.role
                };

                jwt.sign(tokenParams, 'isitascercret',{
                    expiresIn: 3600
                },(err, token) => {
                    return cb(err, token);
                });
            })
}

module.exports.getById = function(userId, cb){
    repository.User.findOne({
        where:{
            id: userId
        }
    }).then(function(user){

        return orderService.getCartByUserId(user.id, function(err, cart){
            
            return cb(null, {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                data:user.data,
                cart:cart
            });
        })


        
    },function(err){
        return cb(err);
    });
}

module.exports.getByEmail = function(email, cb){
    repository.User.findOne({
        where:{
            email: email
        }
    }).then(function(user){

        return orderService.getCartByUserId(user.id, function(err, cart){

            return cb(null, {
                id:user.id,
                name:user.name,
                email:user.email,
                password:user.password,
                role:user.role,
                data:user.data,
                cart:cart
            });
        })
    },function(err){
        return cb(err);
    });
}