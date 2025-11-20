# Lab 10 Report: Introduction to Node.js

## CS-344 Web Engineering

**Name:** Mustafa Hamad
**CMS:** 455095
**Section:** SE-14A

---

## Task 1 — Hello Node

**Goal:** Understand Node execution and async behavior.

**Code:**
```javascript
console.log("1. Start of script");

setTimeout(() => {
    console.log("2. Inside delayed function (2 seconds)");
}, 2000);

console.log("3. End of script");
```

**Output Screenshot:**
```
ultra@SpectreDivide:~/dev/web$ node src/task1/hello.js
1. Start of script
3. End of script
2. Inside delayed function (2 seconds)
```

**Questions:**
*   **Which line prints last? Why?**
    *   The delayed log prints last. `setTimeout` is asynchronous, so it queues the callback and lets the main thread continue.
*   **What does this tell you about Node’s event loop?**
    *   Node is non-blocking. Synchronous code runs first; async callbacks run later via the event loop.

---

## Task 2 — Modules & Importing

**Goal:** Create and import modules.

**Code:**
`src/task2/utils.js`:
```javascript
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

module.exports = {
    add,
    subtract
};
```

`src/task2/main.js`:
```javascript
const utils = require('./utils');

const num1 = 10;
const num2 = 5;

console.log(`Adding ${num1} + ${num2} = ${utils.add(num1, num2)}`);
console.log(`Subtracting ${num1} - ${num2} = ${utils.subtract(num1, num2)}`);
```

**Output Screenshot:**
```
ultra@SpectreDivide:~/dev/web$ node src/task2/main.js
Adding 10 + 5 = 15
Subtracting 10 - 5 = 5
```

---

## Task 3 — package.json & npm Scripts

**Goal:** Use npm scripts.

**Changes to package.json:**
Added `start`/`dev` scripts.

**Output Screenshot:**
```
ultra@SpectreDivide:~/dev/web$ npm run start

> web@1.0.0 start
> node src/task1/hello.js

1. Start of script
3. End of script
2. Inside delayed function (2 seconds)
```

**Question:**
*   **What is the difference between dependencies and devDependencies?**
    *   `dependencies` are for production (e.g., express). `devDependencies` are for development only (e.g., nodemon) and aren't installed in production.

---

## Task 4 — Working with the File System

**Goal:** Read/write files synchronously and asynchronously.

**Code:**
`src/task4/fs-sync.js`:
```javascript
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sync-example.txt');

try {
    console.log('1. Writing file synchronously...');
    fs.writeFileSync(filePath, 'Hello from synchronous write!');
    console.log('2. File written successfully.');

    console.log('3. Reading file synchronously...');
    const data = fs.readFileSync(filePath, 'utf8');
    console.log('4. File content:', data);
} catch (err) {
    console.error('Error:', err);
}
```

`src/task4/fs-async.js`:
```javascript
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'async-example.txt');

console.log('1. Starting asynchronous operations...');

fs.writeFile(filePath, 'Hello from asynchronous write!', (err) => {
    if (err) {
        return console.error('Error writing file:', err);
    }
    console.log('2. File written successfully (Async).');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return console.error('Error reading file:', err);
        }
        console.log('3. File content (Async):', data);
    });
});

console.log('4. End of script (This prints before async operations complete).');
```

**Output Screenshot (Sync):**
```
ultra@SpectreDivide:~/dev/web$ node src/task4/fs-sync.js
1. Writing file synchronously...
2. File written successfully.
3. Reading file synchronously...
4. File content: Hello from synchronous write!
```

**Output Screenshot (Async):**
```
ultra@SpectreDivide:~/dev/web$ node src/task4/fs-async.js
1. Starting asynchronous operations...
4. End of script (This prints before async operations complete).
2. File written successfully (Async).
3. File content (Async): Hello from asynchronous write!
```

**Discussion:**
*   **When should you avoid synchronous operations in real applications?**
    *   Avoid them in servers or high-traffic apps. They block the event loop, freezing the app for all users until the operation finishes.

---

## Task 5 — Using Path & OS Modules

**Goal:** Use system info and paths.

**Code:**
```javascript
const path = require('path');
const os = require('os');
const fs = require('fs');

console.log("========================================");
console.log("      SYSTEM & PATH INFORMATION");
console.log("========================================");

// --- OS Information ---
console.log("\n[ SYSTEM INFO ]");
console.log(`----------------------------------------`);
try {
    console.log(`User Info:       ${os.userInfo().username}`);
} catch (e) {
    console.log(`User Info:       (Hidden/Unavailable)`);
}
console.log(`Home Directory:  ${os.homedir()}`);
console.log(`OS Platform:     ${os.platform()} (${os.type()})`);
console.log(`OS Architecture: ${os.arch()}`);
console.log(`System Uptime:   ${(os.uptime() / 3600).toFixed(2)} hours`);
console.log(`Total Memory:    ${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`);
console.log(`Free Memory:     ${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)} GB`);

// --- Path Operations ---
console.log("\n[ PATH OPERATIONS ]");
console.log(`----------------------------------------`);
console.log(`Current File:    ${path.basename(__filename)}`);
console.log(`Directory:       ${__dirname}`);

const mockPath = path.join(__dirname, 'assets', 'images', 'logo.png');
console.log(`Joined Path:     ${mockPath}`);

const parsedPath = path.parse(__filename);
console.log(`Parsed Path:     Root: '${parsedPath.root}', Name: '${parsedPath.name}', Ext: '${parsedPath.ext}'`);

const absolutePath = path.resolve('src', 'task5', 'readme.txt');
console.log(`Resolved Path:   ${absolutePath}`);

// --- File System ---
console.log("\n[ FILE SYSTEM ]");
console.log(`----------------------------------------`);
console.log("Files in current directory:");

fs.readdir(__dirname, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory:', err);
    }
    files.forEach((file) => {
        const ext = path.extname(file) || '(no extension)';
        console.log(`  • ${file.padEnd(20)} | Type: ${ext}`);
    });
    console.log("\n========================================");
});

```

**Output Screenshot:**
```
ultra@SpectreDivide:~/dev/web$ node src/task5/path-os.js
========================================
      SYSTEM & PATH INFORMATION
========================================

[ SYSTEM INFO ]
----------------------------------------
User Info:       ultra
Home Directory:  /home/ultra
OS Platform:     linux (Linux)
OS Architecture: x64
System Uptime:   1.60 hours
Total Memory:    7.44 GB
Free Memory:     0.61 GB

[ PATH OPERATIONS ]
----------------------------------------
Current File:    path-os.js
Directory:       /home/ultra/dev/web/src/task5
Joined Path:     /home/ultra/dev/web/src/task5/assets/images/logo.png
Parsed Path:     Root: '/', Name: 'path-os', Ext: '.js'
Resolved Path:   /home/ultra/dev/web/src/task5/readme.txt

[ FILE SYSTEM ]
----------------------------------------
Files in current directory:
  • path-os.js           | Type: .js

========================================
```

---

## Task 6 — Events & EventEmitter

**Goal:** Create and handle custom events.

**Code:**
```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// Register a listener for "login"
myEmitter.on('login', (user) => {
    console.log(`User ${user} has logged in.`);
});

// Register a listener that triggers after a delay
myEmitter.on('delayedEvent', () => {
    setTimeout(() => {
        console.log('This event listener triggers after a 1-second delay.');
    }, 1000);
});

// Emit events
console.log('Emitting login event...');
myEmitter.emit('login', 'Alice');

console.log('Emitting delayedEvent...');
myEmitter.emit('delayedEvent');

// Optional: Emit after async operation
const fs = require('fs');
fs.readFile(__filename, (err, data) => {
    if (!err) {
        myEmitter.emit('fileRead');
    }
});

myEmitter.on('fileRead', () => {
    console.log('File read operation completed (Event triggered).');
});
```

**Output Screenshot:**
```
ultra@SpectreDivide:~/dev/web$ node src/task6/events.js
Emitting login event...
User Alice has logged in.
Emitting delayedEvent...
File read operation completed (Event triggered).
This event listener triggers after a 1-second delay.
```

---

## Task 7 — Build a Basic HTTP Server

**Goal:** Handle HTTP requests.

**Code:**
```javascript
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
```

**Output Screenshot (Browser/Terminal):**
```
ultra@SpectreDivide:~/dev/web$ node src/task7/server.js &
[1] 31363
Server running at http://localhost:3000/

ultra@SpectreDivide:~/dev/web$ curl http://localhost:3000/
<h1>Hello, Node.js HTTP Server!</h1><p>Welcome to the root path.</p>

ultra@SpectreDivide:~/dev/web$ curl http://localhost:3000/api
{"message":"This is a JSON response","status":"success"}

ultra@SpectreDivide:~/dev/web$ curl http://localhost:3000/unknown
404 Not Found
```

**Questions:**
*   **How would you return JSON instead of text?**
    *   Set header `Content-Type: application/json` and send stringified JSON with `res.end(JSON.stringify(data))`.
*   **How would you extend this to serve actual HTML files?**
    *   Read the file with `fs.readFile` and send its content via `res.end()` with header `Content-Type: text/html`.

---

## Task 8 — Using Third Party Packages

**Goal:** Install and use npm packages.

**Package Used:** `express` `lodash`

**Code:**
`src/task8/package.js`
```javascript
// Task 8: Using Third Party Packages
// We will use 'lodash' as an example package.
// First, ensure you run: npm install lodash

const _ = require('lodash');

const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

// Use lodash to shuffle the array
const shuffled = _.shuffle(numbers);
console.log('Original:', numbers);
console.log('Shuffled:', shuffled);

// Use lodash to find the difference between two arrays
const array1 = [1, 2, 3];
const array2 = [2, 3, 4];
const difference = _.difference(array1, array2);
console.log('Difference between [1,2,3] and [2,3,4]:', difference);
```

**Output Screenshot**
```
ultra@SpectreDivide:~/dev/web$ node src/task8/package.js
Original: [
  1, 2, 3, 4,
  5, 6, 7, 8
]
Shuffled: [
  5, 2, 4, 1,
  8, 6, 7, 3
]
Difference between [1,2,3] and [2,3,4]: [ 1 ]
```

---

`src/task8/express-server.js`:
```javascript
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
```

**Output Screenshot:**
```
ultra@SpectreDivide:~/dev/web$ node src/task8/express-server.js &
Starting Express Server...
Express Server running at http://localhost:3000/
Try visiting / or /api

ultra@SpectreDivide:~/dev/web$ curl http://localhost:3000/
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Lab 10 - Task 8: Express Server</title>
    ...
</head>
<body>
    <header>
        <h1>Lab 10: Task 8 - Express Server</h1>
    ...
</body>
</html>

ultra@SpectreDivide:~/dev/web$ curl http://localhost:3000/api
{"lab":"Lab 10","task":"Task 8","message":"This is a JSON response from Express","status":"success","framework":"express"}

ultra@SpectreDivide:~/dev/web$ curl http://localhost:3000/unknown
<!DOCTYPE html>
<html>
<head>
    <title>404 Not Found</title>
    ...
</head>
<body>
    ...
    <h1>404</h1>
    <h2>Page Not Found</h2>
    ...
</body>
</html>
```

---

## Conclusion

In this lab, we successfully explored the fundamentals of Node.js, covering its asynchronous nature, module system, and built-in capabilities. We learned how to:
*   Execute JavaScript outside the browser using the Node runtime.
*   Manage project dependencies and scripts with `npm` and `package.json`.
*   Utilize core modules like `fs`, `path`, `os`, and `events` to interact with the file system and operating system.
*   Understand the difference between synchronous and asynchronous operations and their impact on performance.
*   Create a basic HTTP server using the `http` module and enhance it using the popular `express` framework.

This lab provided a strong foundation for building scalable backend applications and understanding the event-driven architecture of Node.js.

