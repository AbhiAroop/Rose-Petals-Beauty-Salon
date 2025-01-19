const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('./components/common/connection.js');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';

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

app.listen(3001, () => {
    console.log('Server running on port 3001');
});