const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'auth-db1760.hstgr.io',
  user: 'u302675659_RosePetals',
  password: 'Aroop007',
  database: 'u302675659_RosePetals',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  
  console.log('Successfully connected to database.');
  
  // Test query
  db.query('SELECT TOP(1) * FROM Service', (err, results) => {
    if (err) {
      console.error('Query error:', err.message);
    } else {
      console.log('Test query successful:', results);
    }
    
    db.end((err) => {
      if (err) {
        console.error('Error closing connection:', err.message);
      } else {
        console.log('Connection closed successfully');
      }
    });
  });
});

// Handle errors
db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
});

