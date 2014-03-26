describe("kTable Basic structure", function () {
	it("Should define kt.Table as a constructor", function () {
		expect(kt.Table).toBeDefined();
	});
	it("Should define kt.Config as a constructor", function () {
		expect(kt.Config).toBeDefined();
	});
	it("Should define kt.Column as a constructor", function () {
		expect(kt.Column).toBeDefined();
	});
	it("Should define kt.Row as a constructor", function () {
		expect(kt.Row).toBeDefined();
	});
	it("Should define kt.Renderer as a constructor", function () {
		expect(kt.Renderer).toBeDefined();
	});
	it("Should create new ctor.Table as a constructor", function () {
		var ctor = kt.ctor([]);
		expect(ctor.Table).toBeDefined();
	});
	it("Should create new ctor.Column as a constructor", function () {
		var ctor = kt.ctor([]);
		expect(ctor.Column).toBeDefined();
	});
	it("Should create new ctor.Row as a constructor", function () {
		var ctor = kt.ctor([]);
		expect(ctor.Row).toBeDefined();
	});
	it("Should create new ctor.Renderer as a constructor", function () {
		var ctor = kt.ctor([]);
		expect(ctor.Renderer).toBeDefined();
	});
	it("Should create new ctor.Table as a constructor", function () {
		var ctor = kt.ctor([]);
		expect(ctor.Table).toNotEqual(kt.Table);
		expect(typeof ctor.Table).toEqual("function");
	});
	it("Should create new ctor.Column as a constructor", function () {
		var ctor = kt.ctor([]);
		expect(ctor.Column).toNotEqual(kt.Column);
		expect(typeof ctor.Column).toEqual("function");
	});
	it("Should create new ctor.Row as a constructor", function () {
		var ctor = kt.ctor([]);
		expect(ctor.Row).toNotEqual(kt.Row);
		expect(typeof ctor.Row).toEqual("function");
	});
	it("Should create new ctor.Renderer as a constructor", function () {
		var ctor = kt.ctor([]);
		expect(ctor.Renderer).toNotEqual(kt.Renderer);
		expect(typeof ctor.Renderer).toEqual("function");
	});
});

describe("kTable init", function () {
	it("Should accept an array", function () {
		expect(typeof kt.ctor([])).toEqual("object");
	});
	it("Should accept a config object", function () {
		expect(typeof kt.ctor({})).toEqual("object");
	});
	it("Should throw if passed null, undefined, number or string", function () {
		expect(function () { kt.ctor(null); }).toThrow();
		expect(function () { kt.ctor(undefined); }).toThrow();
		expect(function () { kt.ctor("test"); }).toThrow();
		expect(function () { kt.ctor(5); }).toThrow();
		expect(function () { kt.ctor(0); }).toThrow();
	});
});