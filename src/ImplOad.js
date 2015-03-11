define(function (require) {
	"use strict";

	var Func = require("Func"),
		Ctor = require("Ctor"),
		TypeRegister = require("TypeRegister");

	return {
		Func: Func,
		Ctor: Ctor,
		String: TypeRegister.String,
		Number: TypeRegister.Number,
		Function: TypeRegister.Function,
		Array: TypeRegister.Array,
		addType: TypeRegister.addType
	};
});