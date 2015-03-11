define(function (require) {
	
	var _ = require("lodash");

	return {
		forEach: _.forEach,
		map: _.map,
		any: _.any,
		find: _.find
	};
});