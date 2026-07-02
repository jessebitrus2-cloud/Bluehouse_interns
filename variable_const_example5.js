//Example5: Block Scoping: Restricts variable availability strictly to the curly braces {} where it is defined.

	if (true) {
 	 const localSecret = "hidden_code";
 	 console.log(localSecret); // Works inside the block
	}
 
	// This will cause an error:
	// console.log(localSecret); // ReferenceError: localSecret is not defined
