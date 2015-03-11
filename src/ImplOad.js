define(function (require) {
	"use strict";

	var Func = require("Func"),
		Ctor = require("Ctor"),
		Types = require("Types");

	return {
		Func: Func,
		Ctor: Ctor,
		String: Types.String,
		Number: Types.Number,
		addType: Types.addType
	};
});