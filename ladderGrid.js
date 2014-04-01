

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
// 

ladderGrid.tbodyTemplate = LadderTemplate.inherit();
ladderGrid.tbodyTemplate.attach('elementType', function () { return 'tbody'; });
ladderGrid.tbodyTemplate.attach('valueBinding', function () { return 'foreach'; });
ladderGrid.tbodyTemplate.attach('valueSource', function () { return '$data.rows'; });
ladderGrid.tbodyTemplate.attach('innerTemplate', function () { return new LadderTemplate.RenderTemplate(); });

ladderGrid.theadTemplate = LadderTemplate.inherit();
ladderGrid.theadTemplate.attach('elementType', function () { return 'thead'; });
ladderGrid.theadTemplate.attach('valueBinding', function () { return ''; });
ladderGrid.theadTemplate.attach('valueSource', function () { return '$data.columns'; });
ladderGrid.theadTemplate.attach('innerTemplate', function () { return new LadderTemplate.RenderTemplate({
	valueSource: '$data.headerTemplate'
}); });

ladderGrid.tfootTemplate = LadderTemplate.inherit();
ladderGrid.tfootTemplate.attach('elementType', function () { return 'tfoot'; });
ladderGrid.tfootTemplate.attach('valueBinding', function () { return ''; });
ladderGrid.tfootTemplate.attach('valueSource', function () { return '$data.columns'; });
ladderGrid.tfootTemplate.attach('innerTemplate', function () { return new LadderTemplate.RenderTemplate({
	valueSource: '$data.footerTemplate'
}); });

ladderGrid.footerTemplate = LadderTemplate.inherit();
ladderGrid.footerTemplate.attach('elementType', function () { return 'tr'; });
ladderGrid.footerTemplate.attach('valueBinding', function () { return 'foreach'; });
ladderGrid.footerTemplate.attach('valueSource', function () { return '$data.columns'; });
ladderGrid.footerTemplate.attach('innerTemplate', function () { return new LadderTemplate.RenderTemplate({
	valueSource: '$data.footerTemplate'
}); });

ladderGrid.headerTemplate = LadderTemplate.inherit();
ladderGrid.headerTemplate.attach('elementType', function () { return 'tr'; });
ladderGrid.headerTemplate.attach('valueBinding', function () { return 'foreach'; });
ladderGrid.headerTemplate.attach('valueSource', function () { return '$data.columns'; });
ladderGrid.headerTemplate.attach('innerTemplate', function () { return new LadderTemplate.RenderTemplate({
	valueSource: '$data.headerTemplate'
}); });

ladderGrid.gridTemplate = LadderTemplate.inherit();
ladderGrid.gridTemplate.attach('templateSource', function () { return $('#tableTemplate').html(); });

ladderGrid.rowTemplate = LadderTemplate.inherit();
ladderGrid.rowTemplate.attach('elementType', function () { return 'tr'; });
ladderGrid.rowTemplate.attach('valueBinding', function () { return 'foreach'; });
ladderGrid.rowTemplate.attach('valueSource', function () { return '$parent.columns'; });
ladderGrid.rowTemplate.attach('innerTemplate', function () { return new LadderTemplate.RenderTemplate(); });

ladderGrid.cellTemplate = LadderTemplate.inherit();
ladderGrid.cellTemplate.attach('elementType', function () { return 'td'; });
ladderGrid.cellTemplate.attach('valueSource', function () { return '$parent.entity[$data.field]'; });

ladderGrid.headerCellTemplate = ladderGrid.cellTemplate.inherit();
ladderGrid.headerCellTemplate.attach("elementType", function () {return 'th';});
ladderGrid.headerCellTemplate.attach("valueSource", function () {return '$data.field';});


ladderGrid.footerCellTemplate = ladderGrid.cellTemplate.inherit();
ladderGrid.footerCellTemplate.attach("elementType", function () {return 'th';});
ladderGrid.footerCellTemplate.attach("valueSource", function () {return '$data.field';});


ladderGrid.Table.attach("gridTemplate", function () {
	return this.template = new this.prototypes.gridTemplate(this.entity.gridTemplate);
});
ladderGrid.Table.attach("tbodyTemplate", function () {
	return new this.prototypes.tbodyTemplate(this.entity.tbodyTemplate);
});
ladderGrid.Table.attach("theadTemplate", function () {
	return new this.prototypes.theadTemplate(this.entity.theadTemplate);
});
ladderGrid.Table.attach("tfootTemplate", function () {
	return new this.prototypes.tfootTemplate(this.entity.tfootTemplate);
});
ladderGrid.Table.attach("footerTemplate", function () {
	return new this.prototypes.footerTemplate(this.entity.footerTemplate);
});
ladderGrid.Table.attach("headerTemplate", function () {
	return new this.prototypes.headerTemplate(this.entity.headerTemplate);
});

ladderGrid.Row.attach("rowTemplate", function () {
	return this.template = new this.prototypes.rowTemplate(this.entity.rowTemplate);
});

ladderGrid.Column.attach("cellTemplate", function () {
	return this.template = new this.prototypes.cellTemplate(this.entity.cellTemplate);
});
ladderGrid.Column.attach("headerCellTemplate", function () {
	return this.headerTemplate = new this.prototypes.headerCellTemplate(this.entity.headerCellTemplate);
});
ladderGrid.Column.attach("footerCellTemplate", function () {
	return this.footerTemplate = new this.prototypes.footerCellTemplate(this.entity.footerCellTemplate);
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