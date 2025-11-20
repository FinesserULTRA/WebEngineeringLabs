const express = require('express');
const app = express();
const PORT = 3000;

console.log("Starting Express Server...");

app.get('/', (req, res) => {
    console.log(`Request received for root path`);
    res.send('<h1>Hello from Express!</h1><p>This server is powered by Express.js</p>');
});

app.get('/api', (req, res) => {
    console.log(`Request received for /api`);
    res.json({ 
        message: "This is a JSON response from Express", 
        status: "success", 
        framework: "express" 
    });
});

// Handle 404
app.use((req, res) => {
    console.log(`404 Request for ${req.url}`);
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}/`);
    console.log(`Try visiting / or /api`);
});
