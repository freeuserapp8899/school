const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./school.db');

app.use(express.json()); // Allows the server to read JSON data
app.use(express.static('.'));

// 1. Get all students (The View)
app.get('/api/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        res.json(rows);
    });
});

// 2. Add a new student (The Gas Pedal)
app.post('/api/students', (req, res) => {
    const { name, age, grade } = req.body;
    db.run("INSERT INTO students (name, age, grade) VALUES (?, ?, ?)", [name, age, grade], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.listen(3000, () => console.log('Engine running at http://localhost:3000'));