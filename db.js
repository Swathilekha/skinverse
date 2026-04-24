const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: 'Swathi1908',       
  database: 'skinverse_db'
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});

module.exports = db;
