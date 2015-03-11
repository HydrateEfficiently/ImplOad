define(function (require) {

	return {
		isString: function (value) {
			return typeof(value) === "string";
		},

		isNumber: function (value) {
			return value !== null && !isNaN(value);
		},

		isArray: function (value) {
			return Array.isArray(value);
		},

		isFunction: function (value) {
			return typeof(value) === "function";
		},

		isObject: function (value) {
			return value !== null && typeof(value) === "object";
		}
	};
});