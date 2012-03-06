(function($){

    var ListView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.render();
        },
        render: function() {
            $(this.el).html('Value: ' + this.model.getForTemplate('value'));
        }
    });

    var testModel1 = new Backbone.AutoModel({value: 1});
    var testModel2 = new Backbone.AutoModel({value: 1});
    var listView1 = new ListView({ model: testModel1, el: $('#main1') });
    var listView2 = new ListView({ model: testModel2, el: $('#main2') });

    setInterval(function() {
        testModel1.set('value', testModel1.get('value') + 1);
        testModel2.set('value', testModel2.get('value') * 2);
    }, 1000);

})(jQuery);
