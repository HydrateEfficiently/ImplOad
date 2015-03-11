define(function (require) {
	"use string";

	var C_STRING_TYPE_KEY = "s",
		C_NUMBER_TYPE_KEY = "n",
		C_FUNCTION_TYPE_KEY = "f",
		C_ARRAY_TYPE_KEY = "a";

	var TypeChecker = require("TypeChecker"),
		Util = require("Util");

	var nativeTypeRegister = { },
		keyRegister = { },
		typeAliasFunctionsByKey = { },
		customTypeRegister = { };

	function convertTypeAliasesToKeys(argumentTypes) {
		return Util.map(argumentTypes, function (argumentType) {
			if (TypeChecker.isString(argumentType) && keyRegister[argumentType]) { // argumentType is already a key
				return argumentType;
			}

			var typeAliasKey = Util.findKey(typeAliasFunctionsByKey, function (typeAliasFunctions) {
				return Util.any(typeAliasFunctions, function (typeAliasFunction) {
					return typeAliasFunction(argumentType);
				});
			});

			if (typeAliasKey === undefined) {
				throw "Unable to find type, or alias to type";
			}

			return typeAliasKey;
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
		keyRegister[key] = true;
	}

	function addTypeAlias(key, aliasFunc) {
		if (!typeAliasFunctionsByKey[key]) {
			typeAliasFunctionsByKey[key] = [];
		}
		typeAliasFunctionsByKey[key].push(aliasFunc);
	}

	function registerType() {

	}

	registerTypeWithKey("String", C_STRING_TYPE_KEY, TypeChecker.isString);
	registerTypeWithKey("Number", C_NUMBER_TYPE_KEY, TypeChecker.isNumber);
	registerTypeWithKey("Function", C_FUNCTION_TYPE_KEY, TypeChecker.isFunction);
	registerTypeWithKey("Array", C_ARRAY_TYPE_KEY, TypeChecker.isArray);
	addTypeAlias(C_ARRAY_TYPE_KEY, TypeChecker.isArray);

	return {
		String: C_STRING_TYPE_KEY,
		Number: C_NUMBER_TYPE_KEY,
		Function: C_FUNCTION_TYPE_KEY,
		Array: C_ARRAY_TYPE_KEY,
		registerType: registerType,
		convertTypeAliasesToKeys: convertTypeAliasesToKeys,
		convertObjectsToKeys: convertObjectsToKeys
	};	
});