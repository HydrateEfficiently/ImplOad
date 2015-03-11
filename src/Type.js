define(function () {

	function isFunction(value) {
		return typeof(value) === "function";
	}

	function isString(value) {
		return typeof(value) === "string";
	}

	function isNumber(value) {
		return value !== null && !isNaN(value);
	}

	return {
		isFunction: isFunction,
		isString: isString,
		isNumber: isNumber
	};
	
});