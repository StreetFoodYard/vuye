const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Set proper MIME types
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Simple API route example
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Basic error handling for development
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Development server running at http://localhost:${port}`);
});
// Auth endpoints for signup
app.post('/api/auth/phone-validation/', (req, res) => {
    // Implement phone validation logic here
    res.json({ id: '123456', phone_number: req.body.phone_number });
});

app.post('/api/auth/email-validation/', (req, res) => {
    // Implement email validation logic here
    res.json({ id: '123456', email: req.body.email });
});