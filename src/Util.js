define(function (require) {
	
	var _ = require("lodash");

	return {
		forEach: _.forEach,
		map: _.map,
		any: _.any,
		find: _.find,
		findKey: _.findKey,

		allEqual: function (array) {
			var length = array.length,
				i;

			if (length === 0) {
				return true;
			}

			for (i = 1; i < length; i++) {
				if (array[i] !== array[i - 1]) {
					return false;
				}
			}
			
			return true;
		}
	};
});