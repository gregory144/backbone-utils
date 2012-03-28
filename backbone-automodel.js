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
        //_.chain(json).keys().each(function(key) {
            //json[key + '-auto-render'] = self.getForTemplate(key);
        //});
        return json;
    }
});

var o_create = Object.create;
if (typeof o_create !== "function") {
  o_create = (function () {
    function F() {}
    return function (o) {
      F.prototype = o;
      return new F();
    };
  })();
}

Backbone.Handlebars = o_create(Handlebars);

Backbone.Handlebars.helpers = o_create(Handlebars.helpers);

/**
  Override the opcode compiler and JavaScript compiler for Handlebars.
*/
Backbone.Handlebars.Compiler = function() {};
Backbone.Handlebars.Compiler.prototype = o_create(Handlebars.Compiler.prototype);
Backbone.Handlebars.Compiler.prototype.compiler = Backbone.Handlebars.Compiler;

Backbone.Handlebars.JavaScriptCompiler = function() {};
Backbone.Handlebars.JavaScriptCompiler.prototype = o_create(Handlebars.JavaScriptCompiler.prototype);
Backbone.Handlebars.JavaScriptCompiler.prototype.compiler = Backbone.Handlebars.JavaScriptCompiler;
Backbone.Handlebars.JavaScriptCompiler.prototype.namespace = "Backbone.Handlebars";

//Backbone.Handlebars.JavaScriptCompiler.prototype.initializeBuffer = function() {
  //return "''";
//};

/**
  Override the default buffer for Backbone Handlebars. By default, Handlebars creates
  an empty String at the beginning of each invocation and appends to it. Backbone's
  Handlebars overrides this to append to a single shared buffer.

  @private
*/
//Backbone.Handlebars.JavaScriptCompiler.prototype.appendToBuffer = function(string) {
  //return "data.buffer.push("+string+");";
//};

/**
  Rewrite simple mustaches from {{foo}} to {{bind "foo"}}. This means that all simple
  mustaches in Backbone's Handlebars will also set up an observer to keep the DOM
  up to date when the underlying property changes.

  @private
*/
Backbone.Handlebars.Compiler.prototype.mustache = function(mustache) {
  console.log('compiler mustache', mustache);
  if (mustache.params.length || mustache.hash) {
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  } else {
    var id = new Handlebars.AST.IdNode(['auto']);

    // Update the mustache node to include a hash value indicating whether the original node
    // was escaped. This will allow us to properly escape values when the underlying value
    // changes and we need to re-render the value.
    if(mustache.escaped) {
      mustache.hash = mustache.hash || new Handlebars.AST.HashNode([]);
      mustache.hash.pairs.push(["escaped", new Handlebars.AST.StringNode("true")]);
    }
    mustache = new Handlebars.AST.MustacheNode([id].concat([mustache.id]), mustache.hash, !mustache.escaped);
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  }
};

/**
  Used for precompilation of Backbone Handlebars templates. This will not be used during normal
  app execution.

  @param {String} string The template to precompile
*/
Backbone.Handlebars.precompile = function(string) {
  var ast = Handlebars.parse(string);
  var options = { data: true, stringParams: true };
  var environment = new Backhone.Handlebars.Compiler().compile(ast, options);
  return new Backbone.Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
};

/**
  The entry point for Backbone Handlebars. This replaces the default Handlebars.compile and turns on
  template-local data and String parameters.

  @param {String} string The template to compile
*/
Backbone.Handlebars.compile = function(string) {
  var ast = Handlebars.parse(string);
  var options = { data: true, stringParams: true };
  var environment = new Backbone.Handlebars.Compiler().compile(ast, options);
  var templateSpec = new Backbone.Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);

  return Handlebars.template(templateSpec);
};

Backbone.Handlebars.registerHelper('auto', function(property, options) {
    console.log('in auto', this, property, options);
    var model = this['_model'];
    if (model && model.get && model.get(property) && model.getForTemplate) {
        return new Handlebars.SafeString(model.getForTemplate(property));
    } else if (this[property]) {
        return new Handlebars.SafeString(this[property]);
    }
    return;
});
