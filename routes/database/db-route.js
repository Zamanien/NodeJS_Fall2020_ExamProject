const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
    host                : process.env.DB_HOST,
    user                : process.env.DB_USER,
    password            : process.env.DB_SECRET,
    database            : process.env.DB_DATABASE,
    port                : process.env.DB_PORT,
    waitForConnections  : true,
    connectionLimit     : 10,
    queueLimit          : 0
});