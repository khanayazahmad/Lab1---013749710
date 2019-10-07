const jwt = require('jsonwebtoken');

module.exports.userAuth = function(request, response, next){
    const token = request.header('x-auth-token');

    if(!token) response.status(401).json({error:"Authentication denied"});

    try{
        const decoded = jwt.verify(token, 'isitascercret');

        request.user = decoded;
        next();
    }catch(e){
        response.status(400);
    }
}