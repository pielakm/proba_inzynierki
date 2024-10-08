const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config()

module.exports = () =>{
    const dbconnection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        multipleStatements: true
    }); 
    
    
    // dbconnection.connect((err) => {
    //     if (err) {
    //       console.log("Database Connection Failed !!!", err);
    //     } else {
    //       console.log("Connected to database");
    //     }
    // });
    
    return dbconnection;
};