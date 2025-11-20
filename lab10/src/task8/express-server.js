const express = require('express');
const app = express();
const PORT = 3000;

console.log("Starting Express Server...");

const styles = `
<style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f0f2f5; color: #333; }
    header { background: #0078d4; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    h1 { margin: 0; font-size: 1.5rem; }
    nav a { color: white; text-decoration: none; margin-left: 20px; font-weight: 500; }
    nav a:hover { text-decoration: underline; }
    .container { max-width: 800px; margin: 40px auto; padding: 20px; }
    .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px; }
    .btn { display: inline-block; background: #0078d4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px; transition: background 0.2s; }
    .btn:hover { background: #005a9e; }
    footer { text-align: center; padding: 20px; color: #666; font-size: 0.9rem; }
</style>
`;

app.get('/', (req, res) => {
    console.log(`Request received for root path`);
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lab 10 - Task 8: Express Server</title>
            ${styles}
        </head>
        <body>
            <header>
                <h1>Lab 10: Task 8 - Express Server</h1>
                <nav>
                    <a href="/">Home</a>
                    <a href="/api">API</a>
                    <a href="/unknown">404 Test</a>
                </nav>
            </header>
            <div class="container">
                <div class="card">
                    <h2>Welcome to Lab 10 Dashboard</h2>
                    <p>This is Task 8: Using Third Party Packages (Express.js).</p>
                    <p>Express makes it easy to build web applications and APIs with Node.js.</p>
                    <a href="/api" class="btn">Check API Endpoint</a>
                </div>
                <div class="card">
                    <h3>Server Status</h3>
                    <p> <strong>Online</strong> running on Port ${PORT}</p>
                    <p> <strong>Time:</strong> ${new Date().toLocaleString()}</p>
                </div>
            </div>
            <footer>
                &copy; 2025 Web Engineering Labs
            </footer>
        </body>
        </html>
    `);
});

app.get('/api', (req, res) => {
    console.log(`Request received for /api`);
    res.json({
        lab: "Lab 10",
        task: "Task 8",
        message: "This is a JSON response from Express",
        status: "success",
        framework: "express"
    });
});

// Handle 404
app.use((req, res) => {
    console.log(`404 Request for ${req.url}`);
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 Not Found</title>
            ${styles}
        </head>
        <body>
            <div class="container" style="text-align: center; margin-top: 100px;">
                <h1 style="font-size: 4rem; color: #d93025;">404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for doesn't exist or has been moved.</p>
                <a href="/" class="btn">Go Back Home</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}/`);
    console.log(`Try visiting / or /api`);
});
