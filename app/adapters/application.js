import DS from 'ember-data';
import ENV from 'pantry-pal/config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.apiURL
});
