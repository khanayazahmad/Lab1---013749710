var connection =  new require('../kafka/connection');
const user = require('./routes/users');
const restaurant = require('./routes/restaurant');
const order = require('./routes/order');
function handleTopicRequest(topic_name,fname){
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        try{var data = JSON.parse(message.value);}
        catch(err){
            console.log(err);
            return;
        }
        
        fname[data.data.task](data.data.payload, function(err,res){
            console.log(res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            try{
            console.log(data);
            producer.send(payloads, function(err, data){
                console.log(data);
            });}catch(err){
                console.log(err);
            }
            return;
        });
        
    });
}

handleTopicRequest('user',user);
handleTopicRequest('restaurant',restaurant);
handleTopicRequest('order',order);