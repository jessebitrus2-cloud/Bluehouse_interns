//Example2: Constant objects. It Prevents replacing the object entirely, 
// but allows modifying its inner properties
 
	const user = { name: "Alex", age: 25 };
 
	// Allowed: Modifying properties
	user.age = 26; 
 
	// Not Allowed: Reassigning the variable
	// user = { name: "Sam" }; // TypeError
