//Example5: Loop Scope Leakage: Leaks loop counters into the surrounding scope, which frequently causes issues in logic and timing.

for (var i = 0; i < 3; i++) {
  // Loop runs
}
 
console.log(i); // Works: outputs 3 (The variable leaked outside the loop)
 
