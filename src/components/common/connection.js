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

  async createBooking(bookingData) {
    try {
      await this.connect();
      
      // Check existing client
      const [client] = await this.query(
        'SELECT ClientID FROM Clients WHERE Phone = ?',
        [bookingData.phone]
      );

      let clientId;
      if (!client) {
        // Create new client
        const result = await this.query(
          'INSERT INTO Clients (FullName, Phone) VALUES (?, ?)',
          [bookingData.fullName, bookingData.phone]
        );
        clientId = result.insertId;
      } else {
        clientId = client.ClientID;
      }

      // Get next AppointmentServiceID
      const [maxId] = await this.query(
        'SELECT MAX(AppointmentServiceID) as maxId FROM AppointmentServices'
      );
      const appointmentServiceId = (maxId.maxId || 0) + 1;

      // Create appointments and services
      for (const service of bookingData.selectedServices) {
        const appointment = await this.query(
          `INSERT INTO Appointments 
           (ClientID, ServiceID, AppointmentDate, TotalPrice, Status, CreatedAt)
           VALUES (?, ?, ?, ?, "Requested", NOW())`,
          [clientId, service.ServiceID, bookingData.appointmentTime, service.Price]
        );

        await this.query(
          `INSERT INTO AppointmentServices 
           (AppointmentID, ServiceID, Price, AppointmentServiceID)
           VALUES (?, ?, ?, ?)`,
          [appointment.insertId, service.ServiceID, service.Price, appointmentServiceId]
        );
      }

      return true;
    } catch (error) {
      console.error('Booking error:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

module.exports = Database;

