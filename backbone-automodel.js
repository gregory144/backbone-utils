Backbone.AutoModel = Backbone.Model.extend({
    getForTemplate: function(attribute) {
        var autoRenderId = _.uniqueId('auto-render-');
        var el = null;
        this.bind('change', function() {
            if (!el) {
                el = $('span.' + autoRenderId);
            }
            el.text(this.get(attribute));
        }, this);
        return "<span class='" + autoRenderId + "'>" + this.get(attribute) + "</span>";
    },
    toJSONForTemplate: function() {
        var json = this.toJSON();
        var self = this;
        _.chain(json).keys().each(function(key) {
            json[key + '-auto-render'] = self.getForTemplate(key);
        });
        return json;
    }
});

Function.prototype.property = function(values) {
    console.log(this, values);
};

Backbone.Handlebars = function() {};

Backbone.Handlebars.Compiler = function() {};
Backbone.Handlebars.Compiler.prototype = _(Handlebars.Compiler.prototype).clone();
Backbone.Handlebars.Compiler.prototype.mustache = function(mustache) {
    console.log(this, mustache);
    return Handlebars.Compiler.prototype.mustache(this, mustache);
};

Backbone.Handlebars.compile = function(string) {
    var ast = Handlebars.parse(string);
    var options = { data: true, stringParams: true };
    var environment = new Backbone.Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavascriptCompiler().compile(environment, options, undefined, true);

    return Handlebars.template(templateSpec);
};


if (Handlebars) {
    Handlebars.registerHelper('auto', function(attribute, options) {
        if (this[attribute] && this[attribute+'-auto-render']) {
            return new Handlebars.SafeString(this[attribute+'-auto-render']);
        }
        if (this[attribute]) {
            return new Handlebars.SafeString(this[attribute]);
        }
        return attribute;
    });
}
