const express = require('express');
const {db,setup} = require('./db')
const app = express();
app.use(express.json());

const PORT = 3030;

app.get('/', (req, res)=> {
    res.send('working fine');
})


app.listen(PORT,async ()=> {
    setup(db)   
})