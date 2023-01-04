const express = require('express');
const PORT = 8000;
const bodyParser = require('body-parser');
const app = express();
const userService = require('./services/user_service');

const emailConfig = require('./config');
const nodeMailer = require('nodemailer');

const expressPublicIp = require('express-public-ip');

const multer = require('multer');
var fileName;
const myStorage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        let name = Date.now() + '-' + file.originalname;
        fileName = name;
        cb(null,fileName);
    }
});

const upload = multer({storage : myStorage});



app.listen(PORT, '0.0.0.0', ()=>{
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

// Mailer
var transporter = nodeMailer.createTransport({
    service : 'gmail',
    secure: true,
    auth : {
        
        user : "", // desired email goes here
        pass : "" // password goes here
    },
    attachments: [
        {
            filename: 'Imp_File',
            content: './uploads/'+fileName
        }
    ]
});


app.post('/user/attachment/send', (req, res)=>{

    var mailOptions = {
        from: '', // from as described
        to : req.body.email_to, // to goes here which comes from user
        subject: 'This is sample pdf doc Test'
    }
    
    transporter.sendMail(mailOptions, function(error, result){
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