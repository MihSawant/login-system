const db = require('mysql2');

const myConnection = db.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "stock_management"
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