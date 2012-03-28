(function($) {

    var TestView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.render();
        },
        render: function() {
            this.$el.html('Value: ' + this.model.get('value'));
        }
    });

    var AppRouter = new Backbone.Router;

    var testModel1 = new Backbone.Model({value: 1});
    var testView1 = new TestView({ model: testModel1 });

    var testModel2 = new Backbone.Model({value: 2});
    var testView2 = new TestView({ model: testModel2 });

    var testModel3 = new Backbone.Model({value: 3});
    var testView3 = new TestView({ model: testModel3 });

    var stateMachine = new Backbone.StateMachine({
        el: '#main',
        startState: 'state1',
        states: {
            'state1': testView1,
            'state2': testView2,
            'state3': testView3
        },
        router: AppRouter
    });

    stateMachine.bind('prechange', function(newState, oldState) {
        console.log('prechange new: ' , newState, 'old:', oldState);
    }, this)
    stateMachine.bind('change', function(newState, oldState) {
        console.log('change new: ' , newState, 'old:', oldState);
    }, this)


    var View = Backbone.View.extend({
        el: '#view',
        initialize: function() {
            _.bindAll(this, 'render');
            stateMachine.bind('change', function(newState) {
                $('#current-state').html(newState);
            });
            stateMachine.bind('enter:state1', function(newState, oldState) {
                console.log('entered state1, left: ', oldState);
            });
            stateMachine.bind('enter:state2', function(newState) {
                console.log('entered state2');
            });
            stateMachine.bind('enter:state3', function(newState) {
                console.log('entered state3');
            });
            stateMachine.bind('exit:state1', function(newState, oldState) {
                console.log('exit state1, left: ', oldState);
            });
            stateMachine.bind('exit:state2', function(newState) {
                console.log('exit state2');
            });
            stateMachine.bind('exit:state3', function(newState) {
                console.log('exit state3');
            });
            $('#current-state').html(stateMachine.getState());
        },
        showView1: function() {
            stateMachine.setState('state1');
        },
        showView2: function() {
            stateMachine.setState('state2');
        },
        showView3: function() {
            stateMachine.setState('state3');
        },
        cycle: function() {
            var stateList = stateMachine.getStateNames();
            var index = _.indexOf(stateList, stateMachine.getState());
            var newState = stateList[++index];
            if (!newState) newState = _.first(stateList);
            stateMachine.setState(newState);
        },
        events: {
            'click button#show-view-1': 'showView1',
            'click button#show-view-2': 'showView2',
            'click button#show-view-3': 'showView3',
            'click button#cycle': 'cycle'
        }
    });
    new View();

    Backbone.history.start({pushState: false, root: '/example/'});

})(jQuery);
