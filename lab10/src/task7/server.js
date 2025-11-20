const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`Request received for: ${req.url}`);

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Hello, Node.js HTTP Server!</h1><p>Welcome to the root path.</p>');
    } else if (req.url === '/api') {
        // Question: How would you return JSON?
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "This is a JSON response", status: "success" }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
