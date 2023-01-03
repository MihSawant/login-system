const express = require('express');
const PORT = 8000;
const bodyParser = require('body-parser');
const app = express();
const userService = require('./services/user_service');

const emailConfig = require('./config');


const multer = require('multer');
var file; var to;
const myStorage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        let name = Date.now() + '-' + file.originalname;
        file = name;
        cb(null,file);
    }
});

const upload = multer({storage : myStorage});

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


app.post('/user/attachment', upload.single('file'), (req, res) =>{
    
    res.json({
    "message" : "File Uploaded"
   });

});

app.post('/user/attachment/send', (req, res)=>{
    to = req.body.email_to;
    emailConfig.transporter.sendMail(emailConfig.mailOptions, function(error, result){
        if(error){
            res.status(500);
            return res.json({
                "error" : true,
                "message" : error.message
            });
        } else{
            console.log('Email Sent: '+result.response);
            res.status(200);
            res.json({
               "message" : "Mail Sent Successfully"
            })
        }
    });
});

module.exports = {
    file, to
}