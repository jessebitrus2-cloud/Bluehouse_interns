let person = {
name: "Jesse",
	sayHi () {
	return `Hi, my Name is ${this.name}`;
	}
};
alert(person.sayHi());