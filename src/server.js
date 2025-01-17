const express = require('express');
const cors = require('cors');
const Database = require('./components/common/connection.js');

const app = express();
app.use(cors());

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