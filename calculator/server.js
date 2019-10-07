const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8081;
app.use(express.json());

app.post('/calculate',(req, res)=>{

  let result = 0;
   console.log(req);
   console.log(req);
   console.log(req);
   console.log(req);
    switch (req.body.signVal){
        case '+':
            result = parseFloat(req.body.prevVal)+ parseFloat(req.body.displayValue);
            break;
        case '-':
            result = parseFloat(req.body.prevVal)- parseFloat(req.body.displayValue);
            break;
        case '*':
            result = parseFloat(req.body.prevVal)* parseFloat(req.body.displayValue);
            break;
        case '/':
            result = parseFloat(req.body.prevVal)/parseFloat(req.body.displayValue);
            break;
        default:
            break;
    }


    res.send({
        status: "ok",
        result});

});


app.listen(port, () => console.log(`Server listening on ${port}!`));

