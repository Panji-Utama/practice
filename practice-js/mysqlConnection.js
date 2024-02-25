require('dotenv').config()

const mysql = require('mysql')

// Buat koneksi ke MySQL
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

con.connect(function (err) {
    if (err) {
        console.error('Error connecting to database: ' + err.stack)
        return
    }
    console.log('Connected to MySQL database.')
})

module.exports = con // Export koneksi untuk digunakan di file lain
