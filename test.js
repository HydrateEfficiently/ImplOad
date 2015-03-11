(function () {

	function getLibraryScriptPath(scriptFileName) {
		return "../lib/" + scriptFileName;
	}

	require.config({
		baseUrl: "src",
		paths: {
			"lodash": getLibraryScriptPath("lodash.compat-2.4.1")
		}
	});

	require(["ImplOad"], function (ImplOad) {

		var Person = (function () {

			function Person(name, age) {
				this.name = name;
				this.age = age;
			}

			Person.prototype.sayName = ImplOad.Func
				.overload(function () {
					this.sayName(this.name);
				})
				.overload(ImplOad.String, function (name) {
					this.speak("My name is " + name);
				});

			Person.prototype.sayAge = ImplOad.Func
				.overload(function () {
					this.sayAge(this.age);
				})
				.overload(ImplOad.Number, function (age) {
					this.sayAge(age, age === this.age ? "trustworthy" : "deceitful");
				})
				.overload(ImplOad.Number, ImplOad.String, function (age, emotion) {
					this.speak("I am " + age + " years old and I'm feeling pretty " + emotion + " about it");
				});

			Person.prototype.speak = function (phrase) {
				console.log(this.name + " said '" + phrase + "'");
			};

			return Person;
		} ());

		var michael = new Person("Michael", 25);
		michael.speak("Hi there!");

		michael.sayName();
		michael.sayName("ughh... Not Michael");

		michael.sayAge();
		michael.sayAge(24);
		michael.sayAge(20, "good");
	});
} ());

