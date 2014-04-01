var getParams = function (args, index) {
	return args.length > index + 1 ? Array.prototype.slice.apply(index) : Array.prototype.concat.call([], args[index])
};

var Ladder = function () {};

Ladder.prototype.init = function (config) {
	var self = this;
	if (!(config instanceof dontInit)) {
		// Only initialize if config is passed, this allows us to create sub-prototypes
		if (this.attachEntity) this.entity = config;
		for (var prop in self) {
			var extender = self[prop];
			if (extender instanceof doAttach) {
				self[prop] = extender.extender.apply(self, extender.args); // || ('' + extender.extender); // if the function doesn't return a value perhaps it only performs operations? Leave a tatle tale behind?
			}
		}
		if (this.populateObject) {
			for (var prop in config) {
				if (config.hasOwnProperty(prop)) {
					var val = config[prop];
					if (ko && ko.isObservable(self[prop])) self[prop](ko.unwrap(val));
					else self[prop] = val;
				}
			}
		}
		for (var prop in self) {
			var extender = self[prop];
			if (extender instanceof doExtend) {
				self[prop] = extender.extender.apply(self, extender.args); // || ('' + extender.extender); // if the function doesn't return a value perhaps it only performs operations? Leave a tatle tale behind?
			}
		}
	}
}

Ladder.prototype.attachEntity = true;
Ladder.prototype.populateObject = true;

Ladder.prototype.attach = function (propertyName, extender) {
	var args = getParams(arguments, 2);
	this.prototype[propertyName] = new doAttach(extender, args);
}

Ladder.prototype.extend = function (propertyName, extender) {
	var args = getParams(arguments, 2);
	this.prototype[propertyName] = new doExtend(extender, args);
}

Ladder.inherit = Ladder.prototype.inherit = function () {
	var ctor = function (config) {
		this.init(config);
	};
	ctor.attach = Ladder.prototype.attach;
	ctor.extend = Ladder.prototype.extend;
	ctor.inherit = Ladder.prototype.inherit;
	ctor.prototype = new this(new dontInit());
	return ctor;
};

Ladder.prototype.attachComputed // doComputed

Ladder.createPrototypes = function (prototypes) {
	return duplicatePrototypes(prototypes);
}

var dontInit = function () {};

// doAttach is called before config and should attach a computed or observable, though you may attach any value you like.
var doAttach = function (extender, args) {
	this.extender = extender;
	this.args = args;
};
var doComputed = function (computed) {
	return new doExtend(function () {
		return ko.computed(computed, this);
	}, []);
};
// doExtend is called after config and would normally perform some init work
// naming convention for extenders is _00Name where 00 is a priority (00 will run before 01) and Name is a descriptive name
var doExtend = function (extender, args) {
	this.extender = extender;
	this.args = args;
};

var duplicatePrototypes = function (prototypes, extenders) {
	var me = {};
	for (var prop in prototypes) {
		if (prototypes.hasOwnProperty(prop)) {
			me[prop] = prototypes[prop].inherit();
			me[prop].prototype.prototypes = me;
		}
	}
	for (var i = 0; i < extenders.length; i++) {
		var extender = extenders[i];
		if(extender.type == "attach")
			me[extender.proto].attach(extender.name, extender.extender, extender.args);
		else
			me[extender.proto].extend(extender.name, extender.extender, extender.args);
	};
	return me;
};
