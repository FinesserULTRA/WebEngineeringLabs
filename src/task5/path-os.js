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
