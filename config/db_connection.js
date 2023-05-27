const mysql = require("mysql");

let connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "dbusers",
  port: 3307,
});

module.exports = connection;
