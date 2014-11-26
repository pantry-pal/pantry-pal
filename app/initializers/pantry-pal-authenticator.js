import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import ENV from 'pantry-pal/config/environment';

// var authUrl = 'http://api.sparehanger.dev/api/auth';
// var authUrl = 'https://api.sparehanger.com/api/auth';
var authUrl = ENV.authUrl;

var SparehangerAuthenticator = Base.extend({
  invalidate: function (data) {
    //SENDS A REQUEST TO THE SERVE TO NULL THE API TOKEN
    var sessionName = "ember_simple_auth:session";
    if (localStorage[sessionName]) {
      var localSession = JSON.parse(localStorage[
        sessionName]);
      if (localSession.token) {
        Ember.$.ajax({
          url: authUrl + "/end",
          type: 'POST',
          data: {
            'user_id': localSession.user_id,
            'token': localSession.token
          }
        });
      }
    }
    return new Ember.RSVP.resolve();
  },
  authenticate: function (credentials) {
    //var username contains both the email AND password
    //ex: username = {email: "BeeTest", password: "1234"}
    //var password is undefined.
    // console.log(username);
    var url = 'https://pantry-pal-api.herokuapp.com/v2/user/auth';
    var data = {
      'credentials': credentials,
    };
    var promise = new Ember.RSVP.Promise(function (resolve, reject) {
      // make the request to authenticate the user at endpoint /v3/token
      Ember.$.ajax({
        url: url,
        type: 'POST',
        data: data
      }).then(function (response) {
        Ember.run(function () {
          if (response.id) {
            resolve(response);
          }
        });
      }, function (xhr, status, error) {

        Ember.run(function () {
          reject(xhr.responseText);
        });
      });
    });
    return promise;
  }
});

export var initialize = function (container, application) {
  container.register('authenticator:pantry-pal',
    SparehangerAuthenticator);
};

export default {
  name: 'pantry-pal-authenticator',
  initialize: initialize
};
