const express = require('express');
const PORT = 8000;
const bodyParser = require('body-parser');
const app = express();
const userService = require('./services/user_service');

app.listen(PORT, ()=>{
    console.log(`server listening on port: ${PORT}`);
});

app.use(bodyParser.json());
app.get('/', (req, res) =>{
    var date = new Date();
    var timeStamp = date.getDate() + '/'+ date.getMonth() + 1 + '/' + date.getFullYear() + '/';
    res.status(200);
    res.json({
        "message" : "Hello "+timeStamp
    });
});


app.post('/user/signup', (req, res) =>{
   try{
    userService.insertNewUser(req, res);
   }catch(e){
        res.json({
            "error" : true,
            "message" : e.message
        })
   }
});

app.post('/user/login', (req, res) =>{
    try{
        userService.checkUser(req, res);
       }catch(e){
            res.json({
                "error" : true,
                "message" : e.message
            })
       }
});