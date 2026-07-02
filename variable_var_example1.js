//Example1: Variable Restriction: Restricts variables only to the boundary of an entire function, 
// ignoring block wrappers like if statements. 
 
function checkDiscount(isMember) {
  if (isMember) {
    var discount = 0.20; // Available throughout the whole function
  }
  console.log(discount); // Works: 0.20 (Even though it is outside the 'if' block)
}
checkDiscount(true);
