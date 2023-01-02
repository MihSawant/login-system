const express = require('express');

const PORT = 8000;
const app = express();

app.listen(PORT, () =>{
    console.log('Started listening on Port: '+PORT);
});

app.get('/', (req, res) =>{
    var date = new Date();
    var timeStamp = date.getDate() + '/'+ date.getMonth() + 1 + '/' + date.getFullYear() + '/';
    res.status(200);
    res.json({
        "message" : "Hello "+timeStamp
    });
});