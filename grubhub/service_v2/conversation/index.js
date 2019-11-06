const repository = require('../../repository_mongo');
const _ = require('lodash');
const async = require('async');


module.exports.getConversation = function(channel, cb){
    repository.Conversation.findOne({
        channel
    }).then(function(conv){
        if(conv){
            return cb(null, conv.data.messages);
        }
        return cb(null, []);
    }, function(err){
        return cb(err);
    })
}

module.exports.createUpdateConversation = function(channel, message, cb){
    return repository.Conversation.findOne({
        channel
    }).then(function(conv){
        
        if(conv){
            conv.data.messages.push(JSON.parse(message));
            return repository.Conversation.updateOne({
                channel
            },{
                data: conv.data
            }).then(function(m){
                return cb();
            }, function(err){
                return cb(err);
            })
        }
        return repository.Conversation.create({
            channel,
            data:{
                messages:[JSON.parse(message)]
            },
            userId: channel.split('-')[0],
            restaurantId: channel.split('-')[1]
        }).then(function(conv){
            return cb(null,conv);
        },function(err){
            return cb(err);
        })
    }, function(err){
        return cb(err);
    })
}