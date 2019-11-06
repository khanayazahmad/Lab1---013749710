const convService = require('../../service_v2/conversation');
const _ = require('lodash');
const async = require('async');


module.exports.get = function(request, response){
    if(!request.params.channel){
        return response.status(400).send("INVALID REQUEST");
    }

    return convService.getConversation(request.params.channel, function(err, data){
        if(err){
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            messages: data
        });
    })
}