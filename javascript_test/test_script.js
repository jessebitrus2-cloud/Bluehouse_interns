// Question 1
function sayHello(name) {
    return `Hello, ${name}!`;
}

function runQ1() {
    let name = prompt("Enter your name:");
    document.getElementById("q1").textContent = sayHello(name);
}

//Queston 2
const subtract = function(a, b) {
    return a - b;
};

function runQ2() {
    let a = Number(prompt("Enter first number"));
    let b = Number(prompt("Enter second number"));

    document.getElementById("q2").textContent =
        `${a} - ${b} = ${subtract(a, b)}`;
}


// Question 3
const divide = (x, y) => x / y;

function runQ3() {
    let x = Number(prompt("Enter first number"));
    let y = Number(prompt("Enter second number"));

    document.getElementById("q3").textContent =
        `${x} / ${y} = ${divide(x, y)}`;
}

// Question 4
function welcome(name = "Visitor", city = "Unknown") {
    return `${name} is from ${city}`;
}

function runQ4() {
    let name = prompt("Enter your name (Leave blank for default):");
    let city = prompt("Enter your city (Leave blank for default):");

    document.getElementById("q4").textContent =
        welcome(name || undefined, city || undefined);
}


// Question 5

function square(num) {
    return num * num;
}

function double(num) {
    return num * 2;
}

function operate(num, func1, func2) {
    return func2(func1(num));
}

function runQ5() {
    let num = Number(prompt("Enter a number:"));

    let result = operate(num, square, double);

    document.getElementById("q5").textContent =
        `Result: ${result}`;
}


// Question 6

(function () {
    console.log("I run immediately!");
})();

function runQ6() {
    document.getElementById("q6").textContent =
        "Check the browser console. The IIFE ran immediately when the page loaded.";
}

// Question 7

const car = {
    brand: "Toyota",

    getInfo() {
        return `This car is a ${this.brand}`;
    }
};

function runQ7() {
    document.getElementById("q7").textContent =
        car.getInfo();
}


// Question 8

const isEven = (n) => n % 2 === 0;

function runQ8() {

    let num = Number(prompt("Enter a number:"));

    document.getElementById("q8").textContent =
        isEven(num)
            ? `${num} is Even`
            : `${num} is Odd`;
}