const express = require('express')
const router = express.Router()
const connection = require('./LocalhostConnection'); // Import the function
const dbconnection = require('./dbConnection'); // Import the function
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
// const bcrypt = require("bcryptjs")

router.post('/createDatabase', (_req, res, next) => {
    const con = connection(); // Get a new connection instance
    con.query('CREATE DATABASE IF NOT EXISTS ??', [process.env.MYSQL_DATABASE], (err, result) => {
        if (err) {
            return next(err); // Handle the error by passing it to the next middleware
        }
        if (result.warningCount === 0) {
            res.json({ message: 'Database created' });
        } else {
            res.json({ message: 'Database already exists' });
        }
    });
});

router.post('/createTable', async (req, res, next) => {
    const db = dbconnection();
    const tables = fs.readFileSync('./tables.sql').toString();

    try {
        await new Promise((resolve, reject) => {
            db.connect(err => {
                if (err) {
                    console.error('Error connecting to the database:', err);
                    return reject(err);
                }
                console.log('Connected to the database');
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.beginTransaction(err => {
                if (err) {
                    console.error('Error starting transaction:', err);
                    return reject(err);
                }

                const queries = tables.split(/;\s*$/m); // Split by semicolon
                let errorOccurred = false;

                queries.forEach(query => {
                    if (query.trim()) { // Skip empty queries
                        db.query(query, (err) => {
                            if (err) {
                                errorOccurred = true;
                                return db.rollback(() => {
                                    console.error('SQL execution error:', err);
                                    reject(err);
                                });
                            }
                            console.log('Query executed successfully');
                        });
                    }
                });

                if (!errorOccurred) {
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Transaction commit error:', err);
                                reject(err);
                            });
                        }
                        console.log('Transaction committed successfully');
                        resolve();
                    });
                }
            });
        });

        res.json({ message: 'Tables created successfully' });
    } catch (error) {
        next(error);
    } finally {
        db.end(); // Ensure the connection is closed
    }
});

router.post('/insertEvent', (req, res, next) =>{
    const db = dbconnection();
    const query = `
    INSERT INTO event (
      name, start_date, end_date, description, number_of_ticket, 
      photo, contact_info, FK_idevent_category, FK_idage_category, 
      FK_idlocation, FK_idevent_status
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    req.query.name,
    req.query.start_date,
    req.query.end_date,
    req.query.description,
    req.query.number_of_ticket,
    req.query.photo,
    req.query.contact_info,
    req.query.FK_idevent_category,
    req.query.FK_idage_category,
    req.query.FK_idlocation,
    req.query.FK_idevent_status
];
  
  // Wykonanie zapytania
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('SQL execution error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
  });
  
});

router.get('/getEvents', (req, res, next) => {
    const db = dbconnection();
    const query = `
    SELECT * FROM event
  `;
  
  // Wykonanie zapytania
  db.query(query, (err, result) => {
    if (err) {
      console.error('SQL execution error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});

router.post('/register', (req, res, next) => {
    const db = dbconnection();
    var name = req.query.name;
    var second_name = req.query.second_name;
    var surname = req.query.surname;
    var FK_iduser_type = req.query.FK_iduser_type;
    var password = req.query.password;
    var email = req.query.email;
    var phonenumber = req.query.phonenumber;
    var zipcode = req.query.zipcode;
    var street = req.query.street;
    var FK_idcity = req.query.FK_idcity;
    var loyal_card_idloyal_card = req.query.loyal_card_idloyal_card;


db.connect(function(err) {
    if (err){
        console.log(err);
    };
    // checking user already registered or no
    db.query(`SELECT * FROM user WHERE name = '${name}' AND password  = '${password}'`, function(err, result){
        if(err){
            console.log(err);
        };
            // inserting new user data
            var sql = `INSERT INTO user (name, second_name, surname, FK_iduser_type, password, email, phonenumber, zipcode, street, FK_idcity, loyal_card_idloyal_card)  VALUES ('${name}', '${second_name}', '${surname}', '${FK_iduser_type}', '${password}', '${email}', '${phonenumber}', '${zipcode}', '${street}', '${FK_idcity}', '${loyal_card_idloyal_card}')`;
            db.query(sql, function (err, result) {
                if (err){
                    console.log(err);
                }else{
                    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
                };
            });
    });
});

})
module.exports = router;
