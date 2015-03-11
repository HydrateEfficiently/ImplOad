define(function (require) {

	var TypeRegister = require("TypeRegister"),
		Util = require("Util");

	var funcHook;

	var Func = function () { };

	Func.prototype.overload = function () {
		var isFuncHook = this === funcHook,
			overloadObj;

		if (isFuncHook) {
			overloadObj =  new Func();
		} else {
			overloadObj = this;
		}

		var argsLength = arguments.length,
			overloadArgs = Array.prototype.slice.call(arguments, 0, argsLength - 1),
			overloadFunc = arguments[argsLength - 1];

		overloadObj._addOverloadEntry(TypeRegister.convertTypeAliasesToKeys(overloadArgs), overloadFunc);

		var theFunc = overloadObj._evaluateOverload();
		theFunc.overload = function () {
			return overloadObj.overload.apply(overloadObj, arguments);
		};
		return theFunc;
	};

	Func.prototype._evaluateOverload = function () {
		var overloadObj = this;
		return function () {
			var overloadArgs = TypeRegister.convertObjectsToKeys(Array.prototype.slice.call(arguments)),
				overloadFunc = overloadObj._getOverloadEntry(overloadArgs);
			overloadFunc.apply(this, arguments);
		};
	};

	Func.prototype._addOverloadEntry = function (overloadArgs, overloadFunc) {
		if (!this.entries) {
			this.entries = {};
		}

		if (overloadArgs.length === 0) {
			this.entries.overloadFunc = overloadFunc;
		} else {
			var self = this,
				numberOfArgs = overloadArgs.length,
				prevEntryLevel = this.entries,
				key,
				i;

			for (i = 0; i < numberOfArgs; i++) {
				key = overloadArgs[i];
				if (!prevEntryLevel[key]) {
					prevEntryLevel[key] = {};
				}
				prevEntryLevel = prevEntryLevel[key];
			}

			prevEntryLevel.overloadFunc = overloadFunc;
		}
	};

	Func.prototype._getOverloadEntry = function (overloadArgs) {
		var currentEntry = this.entries;
		Util.forEach(overloadArgs, function (arg) {
			currentEntry = currentEntry[arg];
		});
		return currentEntry.overloadFunc;
	};

	funcHook = new Func();

	return funcHook;
});