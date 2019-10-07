const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;
const rep = require('./repository');
app.use(express.json());
app.use(require('./routes'));

app.get('/api/testdb',(req, res)=>{
    rep.sequelize.authenticate().then(()=> res.status(200).send("DB Success")).catch(()=>cres.status(500).send('DB Failure'))
});


app.listen(port, () => console.log(`Server listening on ${port}!`));

