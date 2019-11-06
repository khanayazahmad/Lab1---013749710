const userService = require('../../../service_v2/users');

module.exports.register = function(request, response){
        return userService.create(request.body, response);
}

module.exports.update = function(request, response){
    return userService.update(request.body, response);
}

module.exports.get = function(req, response){
    return userService.getById(req.user.id, response);
}