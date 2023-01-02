const db = require('mysql2');

const myConnection = db.createConnection({
    host : "localhost",
    user : "root",
    password : "toor",
    database : "login_sys"
});

myConnection.connect((error) =>{
    if(error){
        console.log('Database Connection Failed', error);
    } else{
        console.log('Database Connected Successfully');
    }
});

module.exports = {
    myConnection
}