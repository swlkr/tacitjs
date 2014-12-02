var chai = require('chai'),
    expect = chai.expect,
    config = require('./config'),
    tacit = require('../lib/tacit')(config),
    Model = require('../lib/model');

describe('Model', function() {
  describe('.define', function() {
    it('should allow the user to define a function', function() {
      var User = tacit.Model('users');
      User.define('isValid', function() {
        return this.email !== null;
      });
      var user = new User({email: 'email@test.com'})
      expect(user.isValid()).to.equal(true);
    });
  });
});
