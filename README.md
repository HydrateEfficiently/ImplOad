# ImplOad
When writing a JavaScript library, argument type checking and value swapping means you have to keep track in your head of what combination of values does what. This is inefficient, difficult to read and hard to maintain. ImplOad (**impl**ementation overl**oad**) is a light-weight JavaScript library for function overloading. ImplOad provides chainable overloads, so you can declare as many or as little overloaded functions as you like. Declaring an overload is as simple as adding a couple of symbols and parenthesis and semantically and visually integrates with normal JavaScript function declaration.

## Installation
_TODO_

## Usage

### Syntax
```Javascript
ImplOad.Func
	.overload(
		someType, // 0 or more type arguments
		function (arg0) { } // Number of arguments in function signature should match number of typeArguments above
	})
	.overload( // Overload as many times as needed
		ImplOad.String,
		ImplOad.Number,
		function (stringValue, numberValue) { }) // Match expected types to functions
	.overload(
		function () { }) // Specify no arguments
	.overload(
		function () { }); // Throws error, we already declared this overload!
```

### Function overloading
Just like normal function declaration, ImplOad gives you access to the object that owns the function, using the "this" keyword.
```Javascript
var person = {

	age: 25,
	
	name: "Michael"
	
	speak: function (phrase) {
		console.log(this.name + " said '" + phrase + "'");
	},
	
	sayName: ImplOad.Func
		.overload(function () {
			this.sayName(this.name);
		})
		.overload(ImplOad.String, function (name) {
			this.speak("My name is " + name);
		})
}

person.sayName(); // Michael said 'My name is Michael'
person.sayName("ughh... Not Michael"); // Michael said 'My name is ughh... Not Michael'
```

### Prototype function overloading
This is simple, just assign the result to the prototype object.
```Javascript
function Person(name, age) {
	this.name = name;
	this.age = age;
}

Person.prototype.speak = function (phrase) {
	console.log(this.name + " said '" + phrase + "'");
};

Person.prototype.sayName = ImplOad.Func
	.overload(function () {
		this.sayName(this.name);
	})
	.overload(ImplOad.String, function (name) {
		this.speak("My name is " + name);
	});

var person = new Person("Michael", 25);
person.sayName(); // Michael said 'My name is Michael'
person.sayName("ughh... Not Michael"); // Michael said 'My name is ughh... Not Michael'
```

### Argument types
Pass in any of these values to specify what "native" argument types the function must take
- Strings: `ImplOad.String`, `window.String`
- Numbers: `ImplOad.Number`, `window.Number`
- Arrays: `ImplOad.Array`, `window.Array`,  `[]`
- Objects: `ImplOad.Object`
- Functions: `ImplOad.Function`
- Not-typed: `ImplOad.Dynamic`

### Declaring array types
By default in ImplOad, array values themselves are untyped when specified:
```Javascript
	ImplOad.Func.overload(ImplOad.Array, function (array) { }); // Don't worry about the value types inside the array
	ImplOad.Func.overload([], function (array) { }); // Equivalent
	ImplOad.Func.overload(Array, function (array) { }); // Equivalent, reference check against window.Array object
	ImplOad.Func.overload([ImplOad.Dynamic], function (array) { }); // Also equivalent
```
However, you can make a function signature more specific by declaring the type of values you want the array to store:
```Javascript
var someFunc = Impload.Func
	.overload([ImplOad.Number], function (arrayOfNumbers) {
		someFunc(arrayOfNumbers.map(function (number) { 
			return number + "";
		});
	})
	.overload([ImplOad.String], function (arrayOfStrings) {
		console.log(arrayOfStrings.join());
	});

someFunc("a", "b", "c"); // Outputs "a,b,c"
someFunc(1, 2, 3); // Outputs "1,2,3"
someFunc("a", "b", 3) // Error! No function signature matches.
```

### Cascading function signatures
ImplOad can sometimes match multiple function signatures to an overloaded function call. This is dealt with by selecting the **most-specific** function signature:
```javascript
var someFunc = ImplOad.Func
	.overload([ImplOad.String], function (arrayOfStrings) {	})
	.overload([ImplOad.Number], function (arrayOfNumbers) {	})
	.overload([], function (arrayOfAnything) { });
	
someFunc("a", "b", "c"); // Calls the first overload
someFunc(1, 2, 3); // Calls the second overload
someFunc("a", "b", 3) // Valid, calls the third overload
```
