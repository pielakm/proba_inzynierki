const express = require('express')
const router = express.Router()
const connection = require('./LocalhostConnection'); // Import the function
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');

router.post('/createDatabase', (req, res, next) => {
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

router.post('/createTable', (req, res, next) => {
    const con = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        multipleStatements: true
    });
    const tables = fs.readFileSync('./tables.sql').toString();

    con.connect(err => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log('Connected to the database');
    
        // Start a transaction
        con.beginTransaction(err => {
            if (err) {
                return console.error('Error starting transaction:', err);
            }
    
            // Split queries if needed, assuming you have multiple statements
            const queries = tables.split(/;\s*$/m); // Split by semicolon (assuming this is your delimiter)
    
            // Execute each query
            queries.forEach(query => {
                if (query.trim()) { // Skip empty queries
                    con.query(query, (err, result) => {
                        if (err) {
                            return con.rollback(() => {
                                console.error('SQL execution error:', err);
                            });
                        }
                        console.log('Query executed successfully:');
                    });
                }
            });
            console.log("Amount of queries: ", queries.length);
            
    
            // Commit transaction
            con.commit(err => {
                if (err) {
                    return con.rollback(() => {
                        console.error('Transaction commit error:', err);
                    });
                }
                console.log('Transaction committed successfully');
            });
        });
    });
});

module.exports = router;
