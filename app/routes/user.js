import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function (controller, user) {
    controller.set('model', user);
  },
});
