'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const userService = require('../service_v2/users');

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'isitascercret'
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
        userService.getById(jwt_payload.id, function(err, user){
            if(err){
                return callback(err, false);
            }
            return callback(null, user);
        })
    }));
};
