import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return this.store.find('user', params).then(function(results){
      return results.content;
    });
  },
});
