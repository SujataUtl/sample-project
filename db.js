// db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // your MySQL username
  password: "",       // your MySQL password
  database: "demo_db" // your MySQL database name
});

db.connect((err) => {
  if (err) throw err;  // If err exists → connection failed, so throw err; stops the program and shows the error.
  console.log("Connected to MySQL Database");
});


module.exports = db;
