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
