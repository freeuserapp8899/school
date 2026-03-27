const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

// 1. Cloud Database Connection
// We use the Connection String you provided
const pool = new Pool({
  connectionString: "postgresql://postgres:[XCDo8J7nEBh0Rw42]@db.aubxrubqxdaxydqejxba.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false // Required for Supabase/Render security
  }
});

// 2. Middleware
app.use(express.json());
app.use(express.static('.')); // Serves your index.html

// 3. API: Get all students
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM students ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. API: Add a student
app.post('/api/students', async (req, res) => {
    const { name, age, grade } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO students (name, age, grade) VALUES ($1, $2, $3) RETURNING *",
            [name, age, grade]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error adding student:", err);
        res.status(500).json({ error: err.message });
    }
});

// 5. Smart Port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloud Engine Live on port ${PORT}`);
});