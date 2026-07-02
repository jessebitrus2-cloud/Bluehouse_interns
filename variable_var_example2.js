//Example1: Variable Hoisting
//Moves the declaration to the top of its scope during execution, initializing it with a value of undefined.

console.log(status); // Works: outputs 'undefined' (No crash/ReferenceError)
 
var status = "active";
console.log(status); // Works: outputs "active"
