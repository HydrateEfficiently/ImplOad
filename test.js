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

			Person.prototype.meet = ImplOad.Func
				.overload(ImplOad.Object, function (person) {
					this.meet([person]);
				})
				.overload([ImplOad.Object], function (people) {
					console.log(this.name + " met with " + people.map(function (person) { return person.name; }).join(", "));
				});


			return Person;
		} ());

		var michael = new Person("Michael", 25);
		michael.speak("Hi there!");

		michael.sayName();
		michael.sayName("ughh... Not Michael");

		michael.sayAge();
		michael.sayAge(24);
		michael.sayAge(20, "good");

		michael.meet(new Person("Jack", 25));
		michael.meet([new Person("Jack", 25), new Person("John", 30), new Person("Jill", 20)]);
	});
} ());

