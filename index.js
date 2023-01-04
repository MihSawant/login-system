const express = require('express');
const PORT = 8000;
const bodyParser = require('body-parser');
const app = express();
const userService = require('./services/user_service');
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = Object.create(null);


async function getip() {
    console.log("called");
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
       
    }
    console.log( "Use this ip address "+ results["en0"][0]+":"+PORT);
    
};


const emailConfig = require('./config');
const nodeMailer = require('nodemailer');
const config = require('./config');

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


getip();

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
    fileName  = req.file.filename;
    
    res.json({
    "message" : req.file.filename
   });

});

// Mailer
var transporter = nodeMailer.createTransport({
    service : 'gmail',
    auth : {
        
        user : config.emailId, // desired email goes here
        pass : config.pass // password goes here
        //its pass not password
    },
   
});


app.post('/user/attachment/send', (req, res)=>{

    var mailOptions = {
        from: config.emailId, // from as described
        to : req.body.email_to, // to goes here which comes from user
        subject: req.body.subject,
        html : req.body.email_body,
        attachments: [
            {
                filename: req.body.file_name,
                path: './uploads/'+req.body.file_name
            }
        ]
    }

    // before sending mail just checking the data
    console.log(req.body.email_to);
    console.log(req.body.email_body);
    console.log(req.body.subject);
    
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