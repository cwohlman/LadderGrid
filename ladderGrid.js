

ladderGrid = { };

ladderGrid.Table = Ladder.inherit();
ladderGrid.Column = Ladder.inherit();
ladderGrid.Row = Ladder.inherit();

ladderGrid.Table.create = function (config) {
    var me = duplicatePrototypes(ladderGrid, config.extenders);
    return new me.Table(config);
}
ladderGrid.Table.prototype.columns = new doComputed(function () {
	var self = this;
	return this.columnDefs.map(function (a) {
		return new self.prototypes.Column(a);
	});
});
ladderGrid.Table.prototype.rows = new doComputed(function () {
	var self = this;
	return this.data.map(function (a) {
		return new self.prototypes.Row(a);
	});
});

// Should be: ladderGrid.Table.prototype.tBodyTemplate = new doAttach(function () {
//     return new LadderTemplate({	
//         elementType: 'tbody',
//         valueBinding: 'foreach',
//         valueSource: '$data.rows',
//         innerTemplate: LadderTemplate.defaultRender
//     })
// })
ladderGrid.Table.prototype.tBodyTemplate = new LadderTemplate({
	elementType: 'tbody',
	valueBinding: 'foreach',
	valueSource: '$data.rows',
	innerTemplate: LadderTemplate.defaultRender
});
ladderGrid.Table.prototype.tHeadTemplate = new LadderTemplate({
	elementType: 'thead',
	valueBinding: '',
	valueSource: '$data.columns',
	innerTemplate: new LadderTemplate({ // we should create a shortcut for this kind of inner template
		elementType: 'virtual',
		valueBinding: 'render',
		valueSource: '$data.headerTemplate'
	})
});
ladderGrid.Table.prototype.tFootTemplate = new LadderTemplate({
	elementType: 'tfoot',
	valueSource: '$data.columns',
	valueBinding: '',
	innerTemplate: new LadderTemplate({
		elementType: 'virtual',
		valueBinding: 'render',
		valueSource: '$data.footerTemplate'
	})
});
ladderGrid.Table.prototype.footerTemplate = new LadderTemplate({
	elementType: 'tr',
	valueSource: '$data.columns',
	valueBinding: 'foreach',
	innerTemplate: new LadderTemplate({
		elementType: 'virtual',
		valueBinding: 'render',
		valueSource: '$data.footerTemplate'
	})
})
ladderGrid.Table.prototype.headerTemplate = new LadderTemplate({
	elementType: 'tr',
	valueSource: '$data.columns',
	valueBinding: 'foreach',
	innerTemplate: new LadderTemplate({
		elementType: 'virtual',
		valueBinding: 'render',
		valueSource: '$data.headerTemplate'
	})
})
ladderGrid.Table.prototype.template = new LadderTemplate({
	templateSource: $('#tableTemplate').html() // instead of using templateSource we should allow an array of inner templates.
});

ladderGrid.Row.prototype.template = new LadderTemplate({
	elementType: 'tr',
	valueBinding: 'foreach',
	valueSource: '$parent.columns',
	innerTemplate: LadderTemplate.defaultRender
});

ladderGrid.Column.prototype.template = new LadderTemplate({
	elementType: 'td',
	valueSource: '$parent.entity[$data.field]'
});
ladderGrid.Column.prototype.headerTemplate = new LadderTemplate({
	elementType: 'th',
	valueSource: '$data.field'
});
ladderGrid.Column.prototype.footerTemplate = new LadderTemplate({
	elementType: 'th',
	valueSource: '$data.field'
});

ko.applyBindings(ladderGrid.Table.create({extenders: [], columnDefs: [
	{field: "test"},
	{field: "a"},
	{field: "b"},
	], data: [
	{test: 5, a: 6, b: 5},
	{test: 5, a: 6, b: 5},
	{test: 5, a: 6, b: 5}
	]}));