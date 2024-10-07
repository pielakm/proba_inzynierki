const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config()

module.exports = () =>{
    const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        multipleStatements: true
    });
    
    connection.connect((err) => {
        if (err) {
          console.log("Localhost Connection Failed !!!", err);
        } else {
          console.log("Connected to Localhost");
        }
    });
    
    return connection;
};