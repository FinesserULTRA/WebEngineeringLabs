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
