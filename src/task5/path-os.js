const path = require('path');
const os = require('os');
const fs = require('fs');

// Display current file name
console.log('Current file:', path.basename(__filename));

// Create a joined path
const mockPath = path.join(__dirname, 'assets', 'images', 'logo.png');
console.log('Mock resource path:', mockPath);

// Display platform info and memory
console.log('OS Platform:', os.platform());
console.log('OS Architecture:', os.arch());
console.log('Total Memory:', (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB');
console.log('Free Memory:', (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB');

// List files in current directory
console.log('\nFiles in current directory:');
fs.readdir(__dirname, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory:', err);
    }
    files.forEach((file) => {
        console.log(`${file} (Extension: ${path.extname(file)})`);
    });
});
