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
