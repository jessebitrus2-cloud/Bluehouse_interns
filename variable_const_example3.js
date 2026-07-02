//Example3: Array Manipulation: Prevents replacing the array reference, 
// but allows adding, removing, or changing elements.

	const colors = ["red", "blue"];
 
	// Allowed: Modifying contents
	colors.push("green"); 
 
	// Not Allowed: Reassigning the variable
	// colors = ["yellow"]; // TypeError
