const userService = require('../../service_v2/users');

module.exports.register = function(request, response){
    if(!(request.body.name && request.body.email && request.body.role && request.body.password)){
        return response.status(400).send("INVALID REQUEST");
    }

    return userService.getByEmail(request.body.email, function(err, user){
        if(err)
            return response.status(500).send(err);
        if(user){
            return response.status(400).send("EMAIL ALREADY EXITS");
        }

        return userService.create(request.body, function(err, data){
            if(err) return response.status(err.code ? err.code : 500).send(err);

            return response.send({
                status: "ok",
                data: data
            });
        });
    });

}

module.exports.login = function(request, response){

    if(!(request.body.email && request.body.password)){
        return response.status(400).send("MISSING FIELDS");
    }

    return userService.getByEmail(request.body.email, function(err, user){
        if(err)
            return response.status(500).send(err);
        if(!user){
            return response.status(400).send("EMAIL DOES NOT EXIST");
        }

        return userService.verifyAndAssignToken(request.body.password, user, function(err, token){
            if(err){
                return response.status(err.code ? err.code : 500).send(err);
            }

            return response.send({
                status: "ok",
                data: {
                    token:"bearer "+token,
                    user:{
                        id:user.id,
                        name:user.name,
                        email:user.email,
                        role:user.role,
                        data:user.data,
                        cart:user.cart
                    }
                }
            });
        });
    });

}

module.exports.update = function(request, response){

    if(!(request.body.email && request.body.name && request.body.id)){
        return response.status(400).send("MISSING FIELDS");
    }
    return userService.update(request.body, function(err, user){
        if(err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            user
        });
    })
}

module.exports.get = function(req, response){
    userService.getById(req.user.id, function(err, user){
        if(err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: {
                user
            }
        });
    })
}