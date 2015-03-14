define(function (require) {
	"use strict";

	var Func = require("Core/Func"),
		Ctor = require("Core/Ctor"),
		SignatureResolver = require("Core/SignatureResolver");

	return {
		Func: Func,
		Ctor: Ctor,
		String: SignatureResolver.String,
		Number: SignatureResolver.Number,
		Function: SignatureResolver.Function,
		Array: SignatureResolver.Array,
		Object: SignatureResolver.Object,
		addType: SignatureResolver.addType
	};
});