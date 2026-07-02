//Example3: Block-Scoped Isolation
//Restricts the variable strictly to the {} block, preventing leaks to outer scopes.

let userRole = "guest";
if (userRole === "guest") {
    let temporaryAccess = true;
  console.log(temporaryAccess); // Works: true
}
 
// Not Allowed: out of scope
// console.log(temporaryAccess); // ReferenceError
