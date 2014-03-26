
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
koTable.Table.prototype.rows = new doComputed(function () {
	var self = this;
	return this.data.map(function (a) {
		return new self.prototypes.Row(a);
	});
});
koTable.Table.prototype.tBodyTemplate = new LadderTemplate({
	elementType: 'tbody',
	valueBinding: 'foreach',
	valueSource: '$data.rows',
	innerTemplate: LadderTemplate.defaultRender
});
koTable.Table.prototype.template = new LadderTemplate({
	elementType: 'table',
	css: ['table'],
	valueBinding: '',
	valueSource: '',
	innerTemplate: koTable.Table.prototype.tBodyTemplate
});

koTable.Row.prototype.template = new LadderTemplate({
	elementType: 'tr',
	valueBinding: 'foreach',
	valueSource: '$parent.columns',
	innerTemplate: LadderTemplate.defaultRender
});

koTable.Column.prototype.template = new LadderTemplate({
	elementType: 'td',
	valueSource: '$parent.entity[$data.field]'
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