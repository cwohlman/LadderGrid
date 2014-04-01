var LadderTemplate = function (config) {
    for (var prop in this) {
        if (this[prop] instanceof Array) {
            // Array properties are references, we'll duplicate them here so we can modify them without affecting the prototype versions.
            this[prop] = this[prop].concat();
        }
    }
    if (typeof config == "function") config(self);
    else {
        for (var prop in config) {
            if (config.hasOwnProperty(prop)) this[prop] = config[prop];
        }
    }
};

LadderTemplate.defaultRender = new LadderTemplate({
    elementType: 'virtual',
    valueSource: "$data.template",
    valueBinding: "render"
});

// Default values, specified on the prototype level
LadderTemplate.prototype.elementType = "div";
LadderTemplate.prototype.valueBinding = "text";
LadderTemplate.prototype.valueSource = "JSON.stringify($data)";
LadderTemplate.prototype.otherBindings = [];
LadderTemplate.prototype.cssBindings = [];
LadderTemplate.prototype.css = [];

LadderTemplate.prototype.allBindings = function() {
    var bindings = [];
    if (this.valueBinding && this.valueSource) bindings.push(this.valueBinding + ": " + this.valueSource);
    if (this.cssBindings && this.cssBindings.length) bindings.push("css: {" +
        this.cssBindings.filter(function (a) {
            return a;
        }).join(", ") 
    + "}");
    if (this.otherBindings) this.otherBindings.filter(function (a) {
        return a;
    }).forEach(function (a) {
        bindings.push(a);
    });
    return bindings;
};

LadderTemplate.prototype.allAttributes = function() {
    var attributes = [];
    if (this.css) attributes.push({
        "name": "class",
        "value": this.css.join(" ")
    });
    if (this.attributes) this.attributes.filter(function (a) {
        return a && a.name;
    }).forEach(function (a) {
        attributes.push(a);
    });
    return attributes;
};
LadderTemplate.prototype.renderVirtual = function () {
    var startTag = "<!-- ko " + this.allBindings().join(", ") + " -->";
    var centerTag = "";
    if (this.innerTemplate) {
        centerTag = $('<div>').append(this.innerTemplate.render()).html();
    }
    var endTag = "<!-- /ko -->";
    return $(startTag + centerTag + endTag);
}
LadderTemplate.prototype.render = function () {
    if (this.elementType == "virtual") return this.renderVirtual();
    if (this.templateSource) return $(this.templateSource);
    var result = $("<" + this.elementType + ">"),
        bindings = this.allBindings(),
        attributes = this.allAttributes()
        ;
    result.attr('data-bind', bindings.join(", "));
    attributes.forEach(function (a) {
        result.attr(a.name, a.value);
    });
    var inner = this.innerTemplate;
    if (typeof inner == "function") inner = this.innerTemplate();
    if (inner instanceof LadderTemplate) {
        result.append(inner.render());
    } else if (inner) {
        throw new Error("innerTemplate must be an instance of LadderTemplate");
    }
    return result;
};

ko.bindingHandlers.render = {
    init: function (element, valueAccessor) {
        var doj = valueAccessor();
        if (!(doj instanceof LadderTemplate)) throw new Error("value must be an instance of LadderTemplate");
        var child = doj.render();
        ko.virtualElements.emptyNode(element);
        for (var i = child.length - 1; i >= 0; i--) {
            ko.virtualElements.prepend(element, child[i]);
        };
    }
}

ko.virtualElements.allowedBindings.render = true;