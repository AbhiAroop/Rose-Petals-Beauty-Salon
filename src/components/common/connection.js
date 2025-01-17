const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.config = {
      host: 'auth-db1760.hstgr.io',
      user: 'u302675659_RosePetals',
      password: 'Aroop007',
      database: 'u302675659_RosePetals',
      port: 3306,
      ssl: {
        rejectUnauthorized: false
      }
    };
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }

  async query(sqlQuery, params = []) {
    try {
      if (!this.connection) {
        await this.connect();
      }
      const [results] = await this.connection.execute(sqlQuery, params);
      return results;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.end();
        console.log('Database disconnected successfully');
      }
    } catch (error) {
      console.error('Error closing connection:', error);
      throw error;
    }
  }
}

module.exports = Database;

