define(function (require) {

	var TypeRegister = require("TypeRegister"),
		Util = require("Util");

	var funcHook;

	var Func = function () {
		this.entries = {};
	};

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
		var overloadSignature = this._getOverloadSignature(overloadArgs);
		if (this.entries[overloadSignature]) {
			throw "Overload already specified for method signature";
		}
		this.entries[overloadSignature] = overloadFunc;
	};

	Func.prototype._getOverloadEntry = function (overloadArgs) {
		var overloadSignature = this._getOverloadSignature(overloadArgs);
		if (!this.entries[overloadSignature]) {
			throw "Overload does not exist for method signature";
		}
		return this.entries[overloadSignature];
	};

	Func.prototype._getOverloadSignature = function (overloadArgs) {
		return overloadArgs.join();
	};

	funcHook = new Func();

	return funcHook;
});