define(function (require) {

	return {
		isString: function (value) {
			return typeof(value) === "string";
		},

		isNumber: function (value) {
			return value !== null && !isNaN(value);
		},

		isArray: function (value) {
			return value.constructor === Array;
		},

		isFunction: function (value) {
			return typeof(value) === "function";
		}
	};
});