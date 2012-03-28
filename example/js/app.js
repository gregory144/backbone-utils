(function($, Backbone) {

    var testModel1 = new Backbone.AutoModel({value: 1});
    var testModel2 = new Backbone.AutoModel({value: 1 });
    var testModel3 = new Backbone.AutoModel({value: 1});
    var testModel4 = new Backbone.AutoModel({value: 1});
    var view1 = new Backbone.HandlebarsView({
        source: '<p>View 1: {{value}}</p>',
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
        var one = testModel1.get('value');
        var two = testModel2.get('value');
        var three = testModel3.get('value');
        var four = testModel4.get('value');
        testModel2.set('value', one + two);
        testModel3.set('value', two + three);
        testModel4.set('value', three + four);
    }, 1000);

})(jQuery, Backbone);
