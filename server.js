const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// 1. Database Connection
// This connects to your school.db file in the same folder
const db = new sqlite3.Database('./school.db', (err) => {
    if (err) {
        console.error("Database opening error: ", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// 2. Middleware
// This allows the server to read JSON data sent from your HTML form
app.use(express.json());
// This serves your index.html file automatically
app.use(express.static('.'));

// 3. API Route: GET (Read)
// This sends the list of students to your table
app.get('/api/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 4. API Route: POST (Create)
// This takes data from your form and saves it to school.db
app.post('/api/students', (req, res) => {
    const { name, age, grade } = req.body;
    const sql = "INSERT INTO students (name, age, grade) VALUES (?, ?, ?)";
    const params = [name, age, grade];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: { id: this.lastID }
        });
    });
});

// 5. Smart Port Listener
// Render uses process.env.PORT, your PC uses 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running! Port: ${PORT}`);
});