define(function (require) {
	"use string";

	var Util = require("Util");

	var nativeTypeRegister = { },
		customTypeRegister = { };

	function convertTypesToKeys(argumentTypes) {
		return Util.map(argumentTypes, function (argumentType) {
			var type = Util.find(nativeTypeRegister, function (registeredType) {
				return argumentType === registeredType;
			});

			if (type === undefined) {
				throw "Unable to find type";
			}
			return type.key;
		});
	}

	function convertObjectsToKeys(argumentObjects) {
		return Util.map(argumentObjects, function (argumentObject) {
			var type = Util.find(nativeTypeRegister, function (registeredType) {
				return registeredType.isType(argumentObject);
			});

			if (type === undefined) {
				throw "Unable to find type";
			}
			return type.key;
		});
		
	}

	function registerTypeWithKey(typeName, key, isTypeFunc) {
		nativeTypeRegister[typeName] = {
			key: key,
			isType: isTypeFunc
		};
	}

	function registerType() {

	}

	registerTypeWithKey("String", "s", function (value) {
		return typeof(value) === "string";
	});

	registerTypeWithKey("Number", "n", function (value) {
		return value !== null && !isNaN(value);
	});

	registerTypeWithKey("Function", "f", function (value) {
		return typeof(value) === "function";
	});

	return {
		String: "s",
		Number: "n",
		registerType: registerType,
		convertTypesToKeys: convertTypesToKeys,
		convertObjectsToKeys: convertObjectsToKeys
	};	
});