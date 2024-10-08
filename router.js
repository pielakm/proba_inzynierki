const express = require('express')
const router = express.Router()
const connection = require('./LocalhostConnection'); // Import the function
const dbconnection = require('./dbConnection'); // Import the function
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');

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


// router.post('/createTable', (req, res, next) => {
//     const db = dbconnection();
//     const tables = fs.readFileSync('./tables.sql').toString();
//     db.connect(err => {
//         if (err) {
//             console.error('Error connecting to the database:', err);
//             return next(err);
//         }
//         console.log('Connected to the database');
//         // Start a transaction
//         db.beginTransaction(err => {
//             if (err) {
//                 console.error('Error starting transaction:', err);
//                 db.end(); // Close the connection on error
//                 return next(err);
//             }

//             const queries = tables.split(/;\s*$/m); // Split by semicolon

//             // Execute each query
//             queries.forEach(query => {
//                 if (query.trim()) { // Skip empty queries
//                     db.query(query, (err, result) => {
//                         if (err) {
//                             return db.rollback(() => {
//                                 console.error('SQL execution error:', err);
//                                 return next(err);
//                             });
//                         }
//                         console.log('Query executed successfully');
//                     });
//                 }
//             });

//             // Commit transaction
//             db.commit(err => {
//                 if (err) {
//                     return db.rollback(() => {
//                         console.error('Transaction commit error:', err);
//                         return next(err);
//                     });
//                 }
//                 console.log('Transaction committed successfully');
//                 res.json({ message: 'Tables created successfully' });
    
//             });
//         });
//     });
// });

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



module.exports = router;
