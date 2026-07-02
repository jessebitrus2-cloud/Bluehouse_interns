ASSIGNMENT
1.	Explain the 3 types of logical operators and give 3 examples of each.
2.	Explain 3 types of javascript variables and give 5 examples of each.
3.	Explain prompt and alert, give any 2 cases of using prompt and any 2 cases of using alert. 

INSTRUCTIONS:
Create a repo (folder) inside Bluehouse_interns with the name “javascript_assignment” and save the assignment inside and upload it to github. 

QUESTION 1
Explain the 3 types of logical operators and give 3 examples of each.

RESPONSES
Logical operators in JavaScript are symbols used to combine, manipulate, or evaluate multiple conditions, traditionally returning a boolean value (true or false) or the value of one of the expressions. 
Logical operators are used to combine or modify boolean values to make decisions. They help control program flow by evaluating whether one or more conditions are true or false.
They are widely used in if statements, loops, and conditions.
Logical operators make it easier to handle multiple conditions at once.

3 types of javascript logical operators include: 
i.	    Logical AND (&&)
ii.	    Logical OR (II)
iii.	Logical NOT (!)

I. Logical AND (&&) Operator
The logical AND (&&) operator checks whether both operands are true. If both are true, the result is true. If any one or both operands are false, the result is false.
It works with numbers as well, treating 0 as false and any non-zero value as true. It treats false, 0, -0, "", null, undefined, NaN and document.all as false.
In JavaScript, the && operator doesn't return true or false unless explicitly working with boolean values. Instead, it returns the actual value of the last operand evaluated:
If the first operand (x) is falsy (like 0, null, undefined, false), it stops and returns that value.
If the first operand is truthy, it evaluates the second operand and returns its value.

Example i. // Check if both conditions are true
		
		age = 20;
		let idProof = true;

		// Logical AND checks both conditions
		if (age >= 20 && idProof) {
  		console.log("Allowed"); 
		} else {
  		console.log("Not Allowed");  
		}

Example ii. // Logical AND with integers
		let x = 5;
		let y = 0;

		// 5 (true) && 0 (false)
		let res = x && y; 
		console.log(res); 

		// 5 (true) && 10 (true)
		res = x && 10;
		console.log(res);

Example iii. 	let hasTicket = true;
		let isIdValid = true;

		// Both must be true to get inside
		if (hasTicket && isIdValid) {
    		console.log("Welcome to the show!");
		} else {
    		console.log("Access denied.");
		}

II. Logical OR (||) Operator
The logical OR (||) operator checks whether at least one of the operands is true. If either operand is true, the result is true. If both operands are false, the result is false.

Rules for ||:
i.	If the first operand is truthy, it stops and returns that value.
ii.	If the first operand is falsy, it evaluates the second operand and returns its value.
Truthy and Falsy Values in JavaScript
i.	Falsy values: false, 0, null, undefined, NaN, and "" (empty string).
ii.	Truthy values: Anything not falsy.

Example i. // Check if at least one condition is true
	let age = 16;
	let hasGuardian = true;

	// Logical OR checks if either condition is true
	if (age >= 18 || hasGuardian) {
  	console.log("Allowed");
	} else {
	console.log("Not Allowed");
	}


Example ii. // Logical OR (||) Operator
	let i = 1;
	let j = null;
	let k = undefined;
	let l = 0;

	console.log(j || k);
	console.log(i || l);

	console.log(Boolean(j || k));
	console.log(Boolean(i || l));

Example iii.
	let isWeekend = false;
	let isHoliday = true;
	// If either condition is true, you don't have to work
	if (isWeekend || isHoliday) {
    	console.log("Time to relax!");
	} else {
    	console.log("Time to work.");
	}

III. Logical NOT (!)
The ! operator inverts the boolean value of an expression. It turns true into false, and false into true.

Example i. 
let isUserLoggedIn = false;
// Checks if the user is NOT logged in
if (!isUserLoggedIn) {
   	 	console.log("Please log in to continue.");
}
Example ii. 
function processPayment(amount) { 
// If amount does NOT exist or is zero, exit early 
   if (!amount) { 
   return "Error: Invalid amount"; 
   } 
   return "Payment processed successfully"; 
   }
Example iii. 	const isLoggedIn = true; 
const showLoginPrompt = !isLoggedIn; 
console.log(showLoginPrompt); // Output: false


QUESTION 2
Explain 3 types of javascript variables and give 5 examples of each.

RESPONSE
JavaScript variables are named containers used to store data values in a computer's memory. Think of a variable as a labeled storage box: the label is the variable's name, and the contents inside the box are the data you want to save, change, or use later in your code.
To use a variable in JavaScript, you must write a line of code that follows a pattern that has a Keyword, (e.g. let), Name (e.g. userName), Assignment Operator (e.g. =) and a value (e.g. “Alex”)
The 3 types of JavaScript variables based on how you declare them are:
1.	const: Used for values that cannot be reassigned and remain constant throughout your program.
2.	let: Used for values that can be changed or reassigned later as your program runs.
3.	var: The legacy keyword that allows reassignment, but is mostly avoided in modern coding due to scoping bugs.

1.	 Const: 
In JavaScript, the const declaration creates a block-scoped variable whose reference cannot be changed through reassignment. [1]
Here are 5 distinct examples demonstrating how const handles different data types, structures, and scopes:
i.	Primitive Values. Locks the binding of a basic data type. Reassignment throws a TypeError.
 	const TAX_RATE = 0.05;

	// This will cause an error:
	// TAX_RATE = 0.08; // TypeError: Assignment to constant variable.

ii.	Constant objects. It Prevents replacing the object entirely, but allows modifying its inner properties

	const user = { name: "Alex", age: 25 };

	// Allowed: Modifying properties
	user.age = 26; 

	// Not Allowed: Reassigning the variable
	// user = { name: "Sam" }; // TypeError

iii.	Array Manipulation: Prevents replacing the array reference, but allows adding, removing, or changing elements.
	const colors = ["red", "blue"];

	// Allowed: Modifying contents
	colors.push("green"); 

	// Not Allowed: Reassigning the variable
	// colors = ["yellow"]; // TypeError

iv.	Arrow Functions: Stores a functional reference securely, preventing accidental replacement of logic.
	const calculateTotal = (price, tax) => price + (price * tax);

	console.log(calculateTotal(100, 0.05)); // 105

v.	Block Scoping: Restricts variable availability strictly to the curly braces {} where it is defined.
	if (true) {
 	 const localSecret = "hidden_code";
 	 console.log(localSecret); // Works inside the block
	}

	// This will cause an error:
	// console.log(localSecret); // ReferenceError: localSecret is not defined

2.     let 

In JavaScript, the let declaration creates a block-scoped variable that allows reassignment of its value later in the code. 
Here are 5 distinct examples demonstrating the flexibility, behavior, and scoping rules of let:
i.	 Reassigning Values
Allows updating the data stored in the variable as program conditions change
let score = 0;
score = 10; // Allowed: value changes to 10
score = score + 5; // Allowed: value changes to 15

ii. Loop Iterators: In JavaScript, using let for loop iterators is best practice because it creates a fresh variable for each individual loop run. This isolates the counter to the loop block and ensures predictable behavior.
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
ii.	Block-Scoped Isolation
Restricts the variable strictly to the {} block, preventing leaks to outer scopes.
let userRole = "guest";
if (userRole === "guest") {
    let temporaryAccess = true;
  console.log(temporaryAccess); // Works: true
}

// Not Allowed: out of scope
// console.log(temporaryAccess); // ReferenceError
iv.  Dynamic Data Types
Allows changing both the value and the underlying data type at runtime.
let response = "Loading..."; // Starts as a string
response = 200; // Allowed: changes to a number
response = { success: true }; // Allowed: changes to an object

 v.  Temporal Dead Zone (TDZ)
Throws a reference error if accessed before declaration, preventing accidental early usage.

// This will cause an error:
// console.log(greeting); // ReferenceError: Cannot access 'greeting' before initialization

let greeting = "Hello!";
console.log(greeting); // Works: "Hello!"


3.  Var 
In JavaScript, the var declaration creates a function-scoped or globally-scoped variable, which behaves very differently from modern let and const.
Here are 5 distinct examples demonstrating the unique quirks, scoping mechanics, and potential pitfalls of var:
i. Variable Restriction: Restricts variables only to the boundary of an entire function, ignoring block wrappers like if statements. 

function checkDiscount(isMember) {
  if (isMember) {
    var discount = 0.20; // Available throughout the whole function
  }
  console.log(discount); // Works: 0.20 (Even though it is outside the 'if' block)
}
checkDiscount(true);

ii.  Variable Hoisting
Moves the declaration to the top of its scope during execution, initializing it with a value of undefined.
console.log(status); // Works: outputs 'undefined' (No crash/ReferenceError)

var status = "active";
console.log(status); // Works: outputs "active"

iii. Variable Re-declaration. It allows variable re-declaration as shown below:

var username = "Alice";
var username = "Bob"; // Allowed: completely overwrites the first one

console.log(username); // Outputs: "Bob"

iv.  Global Window Binding
Attaches the variable directly onto the global window object when declared outside a function. 
var globalConfig = "dark_mode";

// In browser environments:
console.log(window.globalConfig); // Outputs: "dark_mode"

v.  Loop Scope Leakage: Leaks loop counters into the surrounding scope, which frequently causes issues in logic and timing.
for (var i = 0; i < 3; i++) {
  // Loop runs
}

console.log(i); // Works: outputs 3 (The variable leaked outside the loop)

QUESTION 3
Explain prompt and alert, give any 2 cases of using prompt and any 2 cases of using alert.

RESPONSE

PROMPT:
In JavaScript, prompt() is a built-in function that displays a dialog box asking the user to enter some text. It is commonly used to collect simple input from the user.
Syntax
prompt(message);
or
prompt(message, defaultValue);
•	message: The text displayed to the user. 
•	defaultValue (optional): A default value that appears in the input field. 

Instances of Prompt:
Example 1: Basic Prompt
let name = prompt("What is your name?");

console.log("Hello, " + name + "!");

If the user enters Jesse, the output will be:
Hello, Jesse!

Example 2: Prompt with a Default Value
let country = prompt("Enter your country:", "Nigeria");

console.log("Country: " + country);
If the user simply clicks OK, the value will be:
Nigeria
Example 3: Using Prompt to Perform Calculations
let num1 = prompt("Enter the first number:");
let num2 = prompt("Enter the second number:");
let sum = Number(num1) + Number(num2);
alert("The sum is: " + sum);

If the user enters:
•	First number: 10 
•	Second number: 20 
An alert will display:
The sum is: 30

ALERT:
An alert() in JavaScript is a built-in method used to display a virtual pop-up dialog box containing a specified message and a single "OK" button.
It belongs to the browser's window object. Because the window object is global, you can write it simply as alert() instead of window.alert(). When an alert triggers, it creates a modal window. This means it completely blocks the user from interacting with the rest of the webpage and stops the execution of code until the user clicks the "OK" button.
Syntax
•	message (Optional): A string or variable containing the text you want to show. If left empty, a blank pop-up appears.

Instances of JavaScript Alerts
1. Basic Text Alert
The simplest way to use an alert is by passing a text string enclosed in single or double quotation marks. 

javascript
alert("Welcome to our website!");

2. Displaying Variables
You can pass a variable into the function to display dynamic data.

javascript
let username = "Alex";
alert("Hello, " + username + "! Your account is active.");

