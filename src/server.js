const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('./components/common/connection.js');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const db = new Database();
  try {
    const { email, password } = req.body;
    
    const [staff] = await db.query('SELECT * FROM Staff WHERE Email = ?', [email]);
    
    if (!staff || !await bcrypt.compare(password, staff.Password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ staffId: staff.StaffID }, 'your-secret-key', { expiresIn: '24h' });
    
    res.json({
      token,
      staffId: staff.StaffID,
      name: staff.FullName,
      email: staff.Email
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  } finally {
    await db.disconnect();
  }
});

// Middleware to authenticate admin requests
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.staffId = decoded.staffId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get appointments for staff member
app.get('/api/admin/appointments', authenticateAdmin, async (req, res) => {
  const db = new Database();
  try {
    const appointments = await db.query(`
      SELECT 
        aps.AppointmentServiceID,
        c.FullName as ClientName,
        c.Phone,
        MIN(a.AppointmentDate) as AppointmentDate,
        MIN(a.Status) as Status,
        GROUP_CONCAT(s.ServiceName ORDER BY s.ServiceID) as ServiceNames,
        SUM(s.Duration) as TotalDuration,
        GROUP_CONCAT(
          CONCAT(s.ServiceName, ' ($', s.Price, ')') 
          ORDER BY s.ServiceID 
          SEPARATOR ', '
        ) as Services,
        SUM(s.Price) as TotalPrice,
        COUNT(DISTINCT s.ServiceID) as ServiceCount
      FROM AppointmentServices aps
      JOIN Appointments a ON a.AppointmentID = aps.AppointmentID
      JOIN Service s ON s.ServiceID = aps.ServiceID
      JOIN Clients c ON c.ClientID = a.ClientID
      GROUP BY 
        aps.AppointmentServiceID,
        c.FullName,
        c.Phone
      ORDER BY AppointmentDate ASC
    `);
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  } finally {
    await db.disconnect();
  }
});

// Update appointment status
app.put('/api/admin/appointments/:id/status', authenticateAdmin, async (req, res) => {
  const db = new Database();
  try {
    const { status } = req.body;
    const appointmentServiceId = req.params.id;

    // Validate status
    const validStatuses = ['Approved', 'Denied', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update appointments using correct MariaDB syntax
    await db.query(`
      UPDATE Appointments a
      INNER JOIN AppointmentServices aps 
      ON a.AppointmentID = aps.AppointmentID
      SET a.Status = ?
      WHERE aps.AppointmentServiceID = ?
    `, [status, appointmentServiceId]);

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  } finally {
    await db.disconnect();
  }
});

app.post('/api/register', async (req, res) => {
    const db = new Database();
    try {
        const { email, password, fullName, phone, dateOfBirth, address } = req.body;
        
        // Check if email exists
        const existingUser = await db.query('SELECT Email FROM Clients WHERE Email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        await db.query(
            'INSERT INTO Clients (Email, Password, FullName, Phone, DateOfBirth, Address, Account) VALUES (?, ?, ?, ?, ?, ?, "Yes")',
            [email, hashedPassword, fullName, phone, dateOfBirth, address]
        );
        
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await db.disconnect();
    }
});

app.post('/api/login', async (req, res) => {
    const db = new Database();
    try {
        const { email, password } = req.body;
        
        const users = await db.query('SELECT * FROM Clients WHERE Email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.Password);
        
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Don't send password back to client
        delete user.Password;
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await db.disconnect();
    }
});

app.get('/api/services', async (req, res) => {
    const db = new Database();
    try {
        const results = await db.query('SELECT * FROM Service');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await db.disconnect();
    }
});

app.post('/api/bookings', async (req, res) => {
    const db = new Database();
    try {
      const { fullName, phone, services, appointmentTime } = req.body;
  
      // Check/Create client
      let clientId;
      const existingClient = await db.query('SELECT ClientID FROM Clients WHERE Phone = ?', [phone]);
      
      if (existingClient.length > 0) {
        clientId = existingClient[0].ClientID;
      } else {
        const newClient = await db.query(
          'INSERT INTO Clients (FullName, Phone) VALUES (?, ?)',
          [fullName, phone]
        );
        clientId = newClient.insertId;
      }
  
      // Get next AppointmentServiceID
      const [maxId] = await db.query('SELECT MAX(AppointmentServiceID) as maxId FROM AppointmentServices');
      const appointmentServiceId = (maxId.maxId || 0) + 1;
  
      // Create appointments and services
      for (const service of services) {
        const appointment = await db.query(
          `INSERT INTO Appointments 
           (ClientID, ServiceID, AppointmentDate, TotalPrice, Status, CreatedAt)
           VALUES (?, ?, ?, ?, "Requested", NOW())`,
          [clientId, service.ServiceID, appointmentTime, service.Price]
        );
  
        await db.query(
          `INSERT INTO AppointmentServices 
           (AppointmentID, ServiceID, Price, AppointmentServiceID)
           VALUES (?, ?, ?, ?)`,
          [appointment.insertId, service.ServiceID, service.Price, appointmentServiceId]
        );
      }
  
      res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    } finally {
      await db.disconnect();
    }
  });

app.listen(3001, () => {
    console.log('Server running on port 3001');
});