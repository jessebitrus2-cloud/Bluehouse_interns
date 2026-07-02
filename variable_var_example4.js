//Example4: Global Window Binding
//Attaches the variable directly onto the global window object when declared outside a function. 

var globalConfig = "dark_mode";
 
// In browser environments:
console.log(window.globalConfig); // Outputs: "dark_mode"
