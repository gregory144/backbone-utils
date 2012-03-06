(function($){

    var ListView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');

            this.render();
        },
        render: function() {
            var el = $(this.el);
            el.html('');
            el.append('Value: ');
            el.append(this.model.getForTemplate('value'));
        }
    });

    var testModel = new Backbone.AutoModel({value: 1});
    var testModel2 = new Backbone.AutoModel({value: 1});
    var listView = new ListView({ model: testModel, el: $('#main1') });
    var listView = new ListView({ model: testModel2, el: $('#main2') });
    setInterval(function() {
        testModel.set('value', testModel.get('value') + 1);
        testModel2.set('value', testModel.get('value') * 2);
    }, 1000);
})(jQuery);
