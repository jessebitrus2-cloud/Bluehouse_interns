//Example5: Temporal Dead Zone (TDZ)
//Throws a reference error if accessed before declaration, preventing accidental early usage.
 
// This will cause an error:
// console.log(greeting); // ReferenceError: Cannot access 'greeting' before initialization

 
let greeting = "Hello!";
console.log(greeting); // Works: "Hello!"
