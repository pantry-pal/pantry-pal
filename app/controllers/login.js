import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  authenticator: 'authenticator:pantry-pal',
  message: "Enter your email and password.",
  spinner: false,
  error: false,
  email: "",
  password: "",
  actions: {
    login: function () {
      var email = this.get('email');
      this.set('email', email);
      this.set('spinner', true);
      this.send('authenticate');
      return;
    },
    fbLogin: function () {
      var _this = this;
      FB.login(function (response) {
        if (response.authResponse) {
          // var access_token = FB.getAuthResponse()['accessToken'];
          FB.api('/me', function (response) {
            _this.set('password', 'facebook-login');
            response['type'] = 'facebook';
            _this.set('identification', response);
            _this.send('authenticate');
          });
        } else {
          console.log(
            'User cancelled login or did not fully authorize.');
        }
      }, {
        scope: 'email'
      });
    },
    validate: function () {
      this.set('error', false);
      this.set('message', "Enter your email and password.");
      if (this.get('session').isAuthenticated) {
        this.set('spinner', false);
      } else {
        var _this = this;
        setTimeout(function () {
          _this.set('message',
            "Email and password combination were incorrect. Please try again."
          );
          _this.set('error', true);
          _this.set('spinner', false);
        }, 2000);
      }
      if (this.getProperties('password').password === undefined) {
        this.set('message', "No password given.");
        this.set('error', true);
        return;
      }
    }
  }
});
