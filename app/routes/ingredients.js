import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return this.store.find('ingredient', params).then(function(results){
      return results.content;
    });
  }
});
