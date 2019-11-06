const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;
const chat_port = 8081;
app.use(express.json());
app.use(require('./routes'));
var io = require('socket.io')();
const chatService = require('./service_v2/conversation')

io.listen(chat_port);
io.on('connection', function(socket){
    socket.on('channel', function(channel){
        socket.on(channel, (message) => {
            console.log('Message Received: ', message);
            chatService.createUpdateConversation(channel,message,function(err){
                if(err)
                    console.log(err);
            });
            io.emit(channel, message);
            
        })
    });
});


app.listen(port, () => console.log(`Server listening on ${port}!`));