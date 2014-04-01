var LadderTemplate = Ladder.inherit();

LadderTemplate.attach("elementType", function () {
    return "div";
});

LadderTemplate.attach("valueBinding", function () {
    return "text";
});

LadderTemplate.attach("valueSource", function () {
    return "JSON.stringify($data)";
});

LadderTemplate.attach("otherBindings", function () {
    return [];
});

LadderTemplate.attach("cssBindings", function () {
    return [];
});

LadderTemplate.attach("css", function () {
    return [];
});

LadderTemplate.attach("allBindings", function () {
    return function () {
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
});

LadderTemplate.attach("allAttributes", function () {
    return function() {
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
});
LadderTemplate.attach("renderVirtual", function () {
    return function () {
        var startTag = "<!-- ko " + this.allBindings().join(", ") + " -->";
        var centerTag = "";
        if (this.innerTemplate) {
            centerTag = $('<div>').append(this.innerTemplate.render()).html();
        }
        var endTag = "<!-- /ko -->";
        return $(startTag + centerTag + endTag);
    };
});
LadderTemplate.attach("render", function () {
    return function () {
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
});

LadderTemplate.RenderTemplate = LadderTemplate.inherit();
LadderTemplate.RenderTemplate.attach("elementType", function () { return 'virtual'; });
LadderTemplate.RenderTemplate.attach("valueSource", function () { return '$data.template'; });
LadderTemplate.RenderTemplate.attach("valueBinding", function () { return 'render'; });

ko.bindingHandlers.render = {
    init: function (element, valueAccessor) {
        var doj = valueAccessor();
        //if (!(doj instanceof LadderTemplate)) throw new Error("value must be an instance of LadderTemplate");
        var child = doj.render();
        ko.virtualElements.emptyNode(element);
        for (var i = child.length - 1; i >= 0; i--) {
            ko.virtualElements.prepend(element, child[i]);
        };
    }
}

ko.virtualElements.allowedBindings.render = true;