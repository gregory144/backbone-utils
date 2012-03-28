(function($){

    window.Backbone.StateMachine = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'addRoutes', 'initChildren', 'render', 'setState', 'getState', 'getStateNames');
            this.model = new Backbone.Model(options);
            this.model.set('currentState', options.startState);
            this.model.bind('change:currentState', function(model, newState) {
                this.render();
                this.trigger('change', newState, this.model.previous('currentState'));
            }, this);
            this.initChildren();
            this.addRoutes(options.router);
            return this.render();
        },
        addRoutes: function(router) {
            if (!router) return;
            var self = this;
            _.each(this.model.get('states'), function(view) {
                router.route(view.stateName, view.stateName, function() {
                    self.setState(view.stateName);
                });
            });
        },
        initChildren: function() {
            var states = this.model.get('states');
            var self = this;
            _.chain(states).keys().each(function(state) {
                var stateId = _.uniqueId('state-')
                self.$el.append("<div id='" + stateId + "'></div>");
                var stateContainer = $('#' + stateId, self.$el);
                stateContainer.html(states[state].$el);
                stateContainer.hide();
                states[state].$container = stateContainer;
                states[state].stateId = stateId;
                states[state].stateName = state;
            });
        },
        render: function() {
            var states = this.model.get('states');
            var newState = this.model.get('currentState');
            var oldState = this.model.previous('currentState');
            if (oldState) states[oldState].$container.hide();
            states[newState].$container.show();
            if (this.options.router) {
                this.options.router.navigate(newState);
            }
            this.trigger('enter:' + newState, newState, oldState);
            return this;
        },
        setState: function(state) {
            var preState = this.model.get('currentState');
            if (preState == state) return;
            var states = this.model.get('states');
            if (!states[state]) {
                throw state + " is not a valid state";
            }
            this.trigger('exit:' + preState, state, preState);
            this.trigger('prechange', state, preState);
            this.model.set('currentState', state);
            return this;
        },
        getState: function() {
            return this.model.get('currentState');
        },
        getStateNames: function() {
            return _.chain(this.model.get('states')).keys().value();
        }
    });

})(jQuery);
