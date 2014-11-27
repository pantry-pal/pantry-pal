import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.reopen({
  notifyGoogleAnalytics: function() {
    return ga('send', 'pageview', {
        'page': this.get('url'),
        'title': this.get('url')
      });
  }.on('didTransition')
});

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('team', { path: '/team' });
  this.route('stack');
  this.route('erd');
  this.resource('users', function () {
    this.resource('user', {
      path: '/:user_id',
    });
  });
  this.route('register');
  this.route('login');
  this.resource('ingredients', function() {
    this.resource('ingredient', {
      path: '/:ingredient_id'
    });
  });
  this.route('sql');
  this.route('xml');
});

export default Router;
