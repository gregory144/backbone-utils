if (Handlebars) {
    var templateCache = [];

    Backbone.HandlebarsView = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'render', 'renderFromPath', 'renderHandlebarsTemplate');

            _.defaults(options, {
                error: function() {
                    throw "Error getting Handlebars template";
                }
            });

            if (options.source) {
                this.renderHandlebarsTemplate(options.source);
            } else if (options.selector) {
                var $el = $(options.selector);
                if ($el.length) {
                    this.renderHandlebarsTemplate($el.html());
                } else {
                    options.error();
                }
            } else if (options.path) {
                this.renderFromPath(options.path, options.error);
            } else {
                throw "No template specified";
            }
        },
        renderHandlebarsTemplate: function(source, view) {
            this.template = Backbone.Handlebars.compile(source);
            this.render();
        },
        renderFromPath: function(path, error) {
            var cache = templateCache[path];
            if (cache) {
                if (!cache.loading) {
                    this.renderHandlebarsTemplate(cache.source);
                } else {
                    cache.views.push(this);
                }
            } else {
                cache = templateCache[path] = {
                    source: null,
                    loading: true,
                    views: [this]
                };
                $.get(path)
                .success(function(data) {
                    _(cache.views).each(function(view) {
                        view.renderHandlebarsTemplate(data);
                    });
                    cache = templateCache[path] = {
                        source: data,
                        loading: false
                    };
                })
                .error(error);
            }
        },
        render: function() {
            var context = this.model.toJSON();
            context['_model'] = this.model;
            $(this.el).html(this.template(context));
        }
    });
}
