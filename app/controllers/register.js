import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.ObjectController.extend(LoginControllerMixin, {
  authenticator: 'authenticator:pantry-pal',
  email: "",
  password: "",
  formModel: {
    email: "",
    password: "",
    fname: "",
    lname: ""
  },
  checkPassword: "",
  errors: {
    server: "",
    email: "",
    password: "",
    fname: "",
    lname: ""
  },
  actions: {
    login: function (email, password) {
      // return;
      this.set('password', password);
      this.set('email', email);
      this.send('authenticate');
      return;
    },
    register: function () {

      //function to validate email
      function validateEmail(email) {
        var re =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }

      //clear old errors
      for (var key in this.get('errors')) {
        var error = "errors." + key;
        this.set(error, "");
      }

      //validate form
      var formModel = this.get('formModel');
      var clean = true;
      for (var key in formModel) {
        if (key === 'firstName' || key === 'lastName') {
          continue;
        }
        if (formModel[key] === "" || formModel[key] == null) {
          var error = "errors." + key;
          this.set(error, "Required Field.");
          clean = false;
          continue;
        }
        if (key === 'password') {
          if (formModel[key].length < 4) {
            this.set('errors.password',
              'Password must be at least 4 characters.');
            clean = false;
          }
          if (formModel[key] !== this.get('checkPassword')) {
            this.set('errors.password', 'Passwords did not match.');
            this.set('checkPassword', "");
            this.set('formModel.password', "");
            clean = false;
          }

        }
        if (key === 'email' && validateEmail(formModel[key]) === false) {
          this.set('errors.email', 'Invalid Email');
          clean = false;
        }
      }
      var _this = this;
      if (clean) {
        // var authUrl = 'http://api.sparehanger.dev/api/auth';
        var authUrl = 'https://pantry-pal-api.herokuapp.com/v2/user';
        Ember.$.ajax({
          url: authUrl,
          type: 'POST',
          data: _this.get('formModel')
        }).then(function (response) {
          if (response.status === "Success") {
            _this.send('login', _this.get('formModel.email'),
              _this.get('formModel.password'));
            return;
          } else {
              _this.set('errors.server', "uh-oh. something's broken.");
          }
        });
      }
    }
  }
});
