//Example2: Loop Iterators: In JavaScript, using let for loop iterators is best practice, 
// because it creates a fresh variable for each individual loop run. 
// This isolates the counter to the loop block and ensures predictable behavior.
// A simple loop counting from 1 to 3

for (let i = 1; i <= 3; i++) {
  	console.log("Current count:", i); 
  	// Outputs:
  	// "Current count: 1"
  	// "Current count: 2"
  	// "Current count: 3"
}
 
// Trying to use 'i' outside the loop will crash:
// console.log(i); // ReferenceError: i is not defined
