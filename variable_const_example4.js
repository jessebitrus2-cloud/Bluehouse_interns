//Example4:	Arrow Functions: Stores a functional reference securely, preventing accidental replacement of logic.

	const calculateTotal = (price, tax) => price + (price * tax);
 
	console.log(calculateTotal(100, 0.05)); // 105
