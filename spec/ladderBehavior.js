describe("Ladder inheritance behavior", function () {
	it("Should define an inherit function which returns a constructor", function () {
		var ctor = Ladder.inherit();
		expect(typeof ctor).toEqual('function');
	});
	it("Should be the prototype of constructors returned by the  inherit function", function () {
		var ctor = Ladder.inherit();
		expect(ctor.prototype instanceof Ladder).toEqual(true);
	});
})

function DescribeLadderPrototype(name, prototype, setup, teardown) {
	describe("" + name, function () {
		if (setup) {
			beforeEach(setup);
		}
		if (teardown) {
			afterEach(teardown);
		}
		it ("Should be a function", function () {
			expect(typeof prototype).toEqual('function');
		})
		it("Should define an inherit function", function () {
			expect(typeof prototype.inherit).toEqual('function');
		})
		it("Should define an extend function", function () {
			expect(typeof prototype.extend).toEqual('function');
		})
		it("Should define an attach function", function () {
			expect(typeof prototype.attach).toEqual('function');
		})
		it("Should inherit attached properties", function () {
			prototype.attach("__test_property", function () {
				return 5;
			});
			var instance = new prototype({});
			expect(instance["__test_property"]).toEqual(5);
		})
		it("Should not inherit attached properties if no config object passed  in", function () {
			prototype.attach("__test_property", function () {
				return 6;
			});
			var instance = new prototype();
			expect(instance["__test_property"]).toNotEqual(6);
		})
		it("Should create unique properties", function () {
			prototype.attach("__test_property", function () {
				return {};
			});
			var instance = new prototype({});
			var instance2 = new prototype({});
			expect(instance["__test_property"]).toNotBe(instance2["__test_property"]);
		})
		it("Should pass arguments to extender function", function () {
			prototype.attach("__test_property", function (x) {
				return x;
			}, 7);
			var instance = new prototype({});
			expect(instance["__test_property"]).toEqual(7);
		})
		it("Should call attachers in context of new object", function () {
			prototype.attach("__test_property", function () {
				this["__test_property2"] = 8;
			});
			var instance = new prototype({});
			expect(instance["__test_property2"]).toEqual(8);
		})
		it("Should call extenders in context of new object", function () {
			prototype.extend("__test_property", function () {
				this["__test_property2"] = 9;
			});
			var instance = new prototype({});
			expect(instance["__test_property2"]).toEqual(9);
		})
		it("Should call attachers before extenders", function () {
			prototype.attach("__test_property", function () {
				return 10;
			});
			prototype.extend("__test_property2", function () {
				return this["__test_property"];
			});
			var instance = new prototype({});
			expect(instance["__test_property"]).toEqual(instance["__test_property2"]);
		})
		it("Should attach config as entity if specified", function () {
			var config = {};
			config["__test_property3"] = 11;
			var instance = new prototype(config);
			expect(prototype.prototype["attachEntity"]).toEqual(!!instance["entity"]);
			if (prototype.prototype["attachEntity"]) expect(instance["entity"]).toBe(config);
			else expect(instance["entity"]).toBeUndefined();
		})
		it("Should populate new object with config, if specified", function () {
			var config = {};
			config["__test_property4"] = 11;
			var instance = new prototype(config);
			expect(prototype.prototype["populateObject"]).toEqual(!!instance["__test_property4"]);
		})
	})
}


DescribeLadderPrototype("Ladder child", Ladder.inherit());
DescribeLadderPrototype("Ladder grandchild", Ladder.inherit());

DescribeLadderPrototype("Ladder child without knockout", Ladder.inherit(), function () {
	window._ko = window.ko;
	window.ko = undefined;
});
DescribeLadderPrototype("Ladder grandchild without knockout", Ladder.inherit(), function () {
	window._ko = window.ko;
	window.ko = undefined;
});

describe("Ladder inheritance", function () {
	it("should travel to multiple children", function () {
		var prototype = Ladder.inherit();
		prototype.attach("__test_property",function () {return 5});
		var childtype = prototype.inherit();
		childtype.attach("__test_property2", function () {return 6});
		var babytype = childtype.inherit();
		babytype.attach("__test_property3", function () {return 7});

		var instance = new babytype({});

		expect(instance["__test_property"]).toEqual(5);
		expect(instance["__test_property2"]).toEqual(6);
		expect(instance["__test_property3"]).toEqual(7);
	})
	it("should override parent prototype properties with child prototype properties", function () {
		var prototype = Ladder.inherit();
		prototype.attach("__test_property",function () {return 5});
		var childtype = prototype.inherit();
		childtype.attach("__test_property", function () {return 6});
		var babytype = childtype.inherit();
		babytype.attach("__test_property", function () {return 7});

		var instance = new babytype({});

		expect(instance["__test_property"]).toEqual(7);
	})
})