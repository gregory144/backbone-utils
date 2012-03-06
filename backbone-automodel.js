(function($) {

    window.Backbone.AutoModel = Backbone.Model.extend({
        getForTemplate: function(attribute) {
            var autoRenderId = _.uniqueId('auto-render-');
            var el = null;
            this.bind('change', function() {
                if (!el) {
                    el = $('.' + autoRenderId);
                }
                el.text(this.get(attribute));
            }, this);
            return "<span class='" + autoRenderId + "'>" + this.get(attribute) + "</span>";
        }
    });

})(jQuery);
