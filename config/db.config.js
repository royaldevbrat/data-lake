const config = require('./config.json');
const fs = require('fs');
const dataSql = fs.readFileSync('./dump/mysql-dump.sql').toString();
const mysql = require('mysql');
// MySQL Connection
const connection = mysql.createConnection({
  host: config.sql.host,
  user: config.sql.user,
  password: config.sql.password,
  database: config.sql.database,
  multipleStatements: true,
});
// Connection event
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  // console.log('connected as id ' + connection.threadId);
});

//MySQL Query to check for tables
connection.query('SHOW TABLES', function (err, rows) {
  if (err) throw err
  if(!rows.length){
    // Dump Restore
    connection.query(dataSql, (err) => { console.log(err ? err : 'Database Restored!') });
  }
});
// Connection error event listener
connection.on('error', function(err) {
  console.log("[mysql error]", err);
});

module.exports = connection;