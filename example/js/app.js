(function($, Backbone) {

    var testModel1 = new Backbone.AutoModel({
        value: 1,
        computedValue: function() {
            return 'computed:' + this.get('value');
        }.property('value')
    });
    var testModel2 = new Backbone.AutoModel({value: 2});
    var testModel3 = new Backbone.AutoModel({value: 3});
    var testModel4 = new Backbone.AutoModel({value: 4});
    var view1 = new Backbone.HandlebarsView({
        source: '<p>View 1: {{auto "value"}}, {{auto "computedValue"}}</p>',
        model: testModel1,
        el: $('#main1')
    });
    var view2 = new Backbone.HandlebarsView({
        selector: '#view-2',
        model: testModel2,
        el: $('#main2')
    });
    var view3 = new Backbone.HandlebarsView({
        path: '/example/template/view3.handlebars',
        model: testModel3,
        el: $('#main3'),
        error: function(jqXhr, statusText) {
            console.log(statusText);
        }
    });
    var view4 = new Backbone.HandlebarsView({
        path: '/example/template/view3.handlebars',
        model: testModel4,
        el: $('#main4'),
        error: function(jqXhr, statusText) {
            console.log(statusText);
        }
    });

    setInterval(function() {
        testModel1.set('value', testModel1.get('value') + 1);
        testModel2.set('value', testModel2.get('value') * 2);
    }, 1000);

})(jQuery, Backbone);
