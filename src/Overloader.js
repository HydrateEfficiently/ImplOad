define(function (require) {

	var Type = require("Type"),
		Util = require("Util");

	var overloaderHook;

	var Overloader = function () { };

	Overloader.prototype.overload = function () {
		var isOverloaderHook = this === overloaderHook,
			overloadObj;

		if (isOverloaderHook) {
			overloadObj =  new Overloader();
		} else {
			overloadObj = this;
		}

		var argsLength = arguments.length,
			overloadArgs = Array.prototype.slice.call(arguments, 0, argsLength - 1),
			overloadFunc = arguments[argsLength - 1];

		overloadObj._addOverloadEntry(this._convertPsuedoTypesToKey(overloadArgs), overloadFunc);

		var theFunc = overloadObj._evaluateOverload();
		theFunc.overload = function () {
			return overloadObj.overload.apply(overloadObj, arguments);
		};
		return theFunc;
	};

	Overloader.prototype._evaluateOverload = function () {
		var overloadObj = this;
		return function () {
			var overloadArgs = overloadObj._convertObjectsToKey(Array.prototype.slice.call(arguments)),
				overloadFunc = overloadObj._getOverloadEntry(overloadArgs);
			overloadFunc.apply(this, arguments);
		};
	};

	Overloader.prototype._convertPsuedoTypesToKey = function (rawArguments) {
		return Util.map(rawArguments, function (arg) {
			switch (arg) {
				case Number:
					return "n";
				case String:
					return "s";
				default:
					throw "Unrecognised argument type";
			}
		});
	};

	Overloader.prototype._convertObjectsToKey = function (rawArguments) {
		return Util.map(rawArguments, function (arg) {
			if (Type.isString(arg)) {
				return "s";
			} else if (Type.isNumber(arg)) {
				return "n";
			} else {
				throw "Unrecognised argument type";
			}
		});
	};

	Overloader.prototype._addOverloadEntry = function (overloadArgs, overloadFunc) {
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

	Overloader.prototype._getOverloadEntry = function (overloadArgs) {
		var currentEntry = this.entries;
		Util.forEach(overloadArgs, function (arg) {
			currentEntry = currentEntry[arg];
		});
		return currentEntry.overloadFunc;
	};

	overloaderHook = new Overloader();

	return overloaderHook;
});