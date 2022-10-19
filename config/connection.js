const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host:"localhost",
    port: 3000,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

module.exports = db;