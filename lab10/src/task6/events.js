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

