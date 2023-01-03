const express = require('express');
const PORT = 8000;
const bodyParser = require('body-parser');
const app = express();
const userService = require('./services/user_service');



const multer = require('multer');

const myStorage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        let name = Date.now() + '-' + file.originalname;
        cb(null, file.fieldname+'-'+name);
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