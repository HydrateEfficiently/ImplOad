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

	require(["Overloader"], function (Overloader) {

		var Person = (function () {

			function Person(name) {
				this.name = name;
			}

			Person.prototype.sayName = Overloader
				.overload(function () {
					this.sayName(this.name);
				})
				.overload(String, function (name) {
					this.speak("My name is " + name);
				});

			Person.prototype.speak = function (phrase) {
				console.log(this.name + " said '" + phrase + "'");
			};

			return Person;
		} ());

		var michael = new Person("Michael");
		michael.speak("Hi there!");
		michael.sayName();
		michael.sayName("ughh... Not Michael");
	});
} ());

