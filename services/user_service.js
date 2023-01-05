const db = require('../db/database_connection');

function insertNewUser(req, res){
    let user_email = String(req.body.email);
    let password = String(req.body.password);
    
    if(user_email === "undefined"){
        res.status(400);
        res.json({
            "error" : true,
            "message" : "Email is Required Field"
        });
    } else if(password === "undefined"){
        res.status(400);
        res.json({
            "error" : true,
            "message" : "Password is Required Field"
        });
    } else if(password === "undefined" && user_email  === "undefined"){
        res.status(400);
        res.json({
            "error" : true,
            "message" : "Email and Password is Required"
        });
    } else{

                 // check does user already exists
    let userCheck = `SELECT COUNT(email) AS user_count FROM users WHERE email = '${user_email}'`;

    db.myConnection.query(userCheck, (error, result) =>{
        var first = Object.values(result)[0];
        var count = Object.values(first)[0];  
        if(error){
            throw error;
        } 
        else if(count > 0){
                res.status(409);
                return res.json({
                    "error" : true,
                    "message" : "User Already Exists !"
                });
        } 
        else{
            let insertQuery = `INSERT INTO users(email, password) VALUES('${user_email}', '${password}')`;
            db.myConnection.query(insertQuery, (error, result)=>{
                if(error) {
                    throw error;
                } else{
                    // 201 created
                    res.status(201);
                   return res.json({
                            "message" : "Record Inserted Successfully !"
                });

                }
                
            });
        }
    });
    }
        
 



}


function checkUser(req, res){
    let user_email = String(req.body.email);
    var user = `SELECT password FROM users WHERE email = '${user_email}'`;
    let enteredPass = String(req.body.password);
   
   db.myConnection.query(user, (error, result)=>{
   
      
    if(result.length > 0){
        var first = Object.values(result)[0];
        var pass = Object.values(first)[0];

        if(error){
            throw error;
        } else{
            if(pass === undefined){
                res.status(404);
                res.json({
                    "error" : true,
                    "message" : "User Not Found !"
                });
            }
            if(String(pass) === enteredPass){
                res.status(200);
                res.json({
                    "message" : "Password Match Success"
                });
            } else{
                res.status(400);
                res.json({
                    "error" : true,
                    "message" : "Password Match Fail"
                });
            }
        }

    } else{
        res.status(404);
        res.json({
            "error" : true,
            "message" : "User Does not Exists !"
        });
    }
   });
}
    

module.exports = {
    insertNewUser, checkUser
}