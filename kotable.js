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
var initializeInstance = function (self, config) {
	this.entity = config;
	// Attach first, then config properties will update observables/computeds 
	// created by the extenders
	for (var prop in self) {
		var extender = self[prop];
		if (extender instanceof doAttach) {
			self[prop] = extender.extender.apply(self, extender.args);
		}
	}
	for (var prop in config) {
		if (config.hasOwnProperty(prop)) {
			var val = config[prop];
			if (ko.isObservable(self[prop])) self[prop](ko.unwrap(val));
			else self[prop] = val;
		}
	}
	for (var prop in self) {
		var extender = self[prop];
		if (extender instanceof doExtend) {
			self[prop] = extender.extender.apply(self, extender.args);
		}
	}
};

var duplicatePrototypes = function (prototypes, extenders) {
	var me = {};
	for (var prop in prototypes) {
		if (prototypes.hasOwnProperty(prop)) {
			me[prop] = function (config) {
				initializeInstance(this, config);
			}
			me[prop].prototype = new prototypes[prop];
            me[prop].prototype.prototypes = me;
		}
	}
	for (var i = 0; i < extenders.length; i++) {
		var extender = extenders[i];
		me[extender.proto] = extender.type == "attach" ? 
			new doAttach(extender.extender, extender.args) :
			new doExtend(extender.extender, extender.args);
	};
	return me;
};

koTable = { };

koTable.Table = function () {};
koTable.Column = function () {};
koTable.Row = function () {};

koTable.Table.create = function (config) {
    var me = duplicatePrototypes(koTable, config.extenders);
    return new me.Table(config);
}
koTable.Table.prototype.columns = new doComputed(function () {
	var self = this;
	return this.columnDefs.map(function (a) {
		return new self.prototypes.Column(a);
	});
});

ko.applyBindings(koTable.Table.create({extenders: [], columnDefs: [
	{field: "test"},
	{field: "a"},
	{field: "b"},
	], data: [
	{test: 5, a: 6, b: 5},
	{test: 5, a: 6, b: 5},
	{test: 5, a: 6, b: 5}
	]}));