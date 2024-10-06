// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();


app.use(express.json());
app.use(cors());
dotenv.config();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


db.connect((err) => {
    if (err) {
        console.log('ERROR CONNECTING to MySQL:', err);
    } else {
        console.log('Connected to MySQL successfully. Connection ID:', db.threadId);
    }
});


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//question  1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving patients:', err);
            res.status(500).send('Error retrieving patients');
        } else {
            res.render('patients', { results: results });
        }
    });
});

//question  2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving providers:', err);
            res.status(500).send('Error retrieving providers');
        } else {
            res.render('providers', { results: results });
        }
    });
});

//question  3. Filter patients by First Name
app.get('/patients/filter', (req, res) => {
    const { first_name } = req.query;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [first_name], (err, results) => {
        if (err) {
            console.error('Error retrieving filtered patients:', err);
            res.status(500).send('Error retrieving patients by first name');
        } else {
            res.render('patients', { results: results }); 
        }
    });
});

// question 4. Retrieve all providers by their specialty
app.get('/providers/filter', (req, res) => {
    const { specialty } = req.query;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
        if (err) {
            console.error('Error retrieving providers by specialty:', err);
            res.status(500).send('Error retrieving providers by specialty');
        } else {
            res.render('providers', { results: results }); 
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});
