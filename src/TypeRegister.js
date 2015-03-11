define(function (require) {
	"use string";

	var C_STRING_TYPE_KEY = "s",
		C_NUMBER_TYPE_KEY = "n",
		C_FUNCTION_TYPE_KEY = "f",
		C_ARRAY_TYPE_KEY = "a",
		C_OBJECT_TYPE_KEY = "o";

	var TypeChecker = require("TypeChecker"),
		Util = require("Util");

	var nativeTypeRegister = { },
		keyRegister = { },
		typeAliasFunctionsByKey = { },
		customTypeRegister = { };

	function getKeyFromArgumentType(argumentType) {
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
	}

	function getKeyFromArgumentObject(argumentObject) {
		var type = Util.find(nativeTypeRegister, function (registeredType) {
			return registeredType.isType(argumentObject);
		});

		if (type === undefined) {
			throw "Unable to find type";
		}
		return type.key;
	}

	function convertTypeAliasesToKeys(argumentTypes) {
		return Util.map(argumentTypes, function (argumentType) {
			if (TypeChecker.isArray(argumentType)) {
				if (argumentType.length > 0) {
					if (argumentType.length === 1) {
						return C_ARRAY_TYPE_KEY + ":" + getKeyFromArgumentType(argumentType[0]);
					} else {
						throw "Can only specify an array of types with one entrie";
					}
				}
			}
			return getKeyFromArgumentType(argumentType);
		});
	}

	function convertObjectsToKeys(argumentObjects) {
		return Util.map(argumentObjects, function (argumentObject) {
			if (TypeChecker.isArray(argumentObject)) {
				if (argumentObject.length === 0) {
					throw "This is not supported yet, sorry!";
				}

				var mappedToKeys = Util.map(argumentObject, function (arrayEntry) {
					return getKeyFromArgumentObject(arrayEntry);
				});

				if (!Util.allEqual(mappedToKeys)) {
					throw "Values in array are not the same type.";
				}

				return getTypedArrayKey(mappedToKeys[0]);
			}
			return getKeyFromArgumentObject(argumentObject);
		});
	}

	function getTypedArrayKey(typeKey) {
		return C_ARRAY_TYPE_KEY + ":" + typeKey;
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
	addTypeAlias(C_STRING_TYPE_KEY, function (value) { return value === String; });
	registerTypeWithKey("Number", C_NUMBER_TYPE_KEY, TypeChecker.isNumber);
	addTypeAlias(C_NUMBER_TYPE_KEY, function (value) { return value === Number; });
	registerTypeWithKey("Function", C_FUNCTION_TYPE_KEY, TypeChecker.isFunction);
	registerTypeWithKey("Array", C_ARRAY_TYPE_KEY, TypeChecker.isArray);
	addTypeAlias(C_ARRAY_TYPE_KEY, TypeChecker.isArray);
	addTypeAlias(C_ARRAY_TYPE_KEY, function (value) { return value === Array; });
	registerTypeWithKey("Object", C_OBJECT_TYPE_KEY, TypeChecker.isObject);
	addTypeAlias(C_OBJECT_TYPE_KEY, TypeChecker.isObject);

	return {
		String: C_STRING_TYPE_KEY,
		Number: C_NUMBER_TYPE_KEY,
		Function: C_FUNCTION_TYPE_KEY,
		Array: C_ARRAY_TYPE_KEY,
		Object: C_OBJECT_TYPE_KEY,
		registerType: registerType,
		convertTypeAliasesToKeys: convertTypeAliasesToKeys,
		convertObjectsToKeys: convertObjectsToKeys
	};	
});