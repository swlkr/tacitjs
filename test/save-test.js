var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    config = require('./config'),
    tacit = require('../lib/tacit')(config);

chai.use(chaiAsPromised);

describe('Record', function() {
  describe('#save', function() {
    before(function() {
      return tacit.Query("create table users (id int primary key identity(1,1), email nvarchar(256) unique not null)");
    });

    after(function() {
      return tacit.Query('drop table users');
    });

    it('should save a new record to the database', function() {
      var User = tacit.Model('users');
      var user = new User({email: 'test@test.com'});
      return expect(user.save()).to.eventually.include.keys('id');
    });

    it('should save an existing record to the database', function() {
      var User = tacit.Model('users');
      var user = new User({email: 'update@example.com'});
      return user.save().then(function(u) {
        u.email = 'updated_email@example.com';
        return expect(u.save()).to.eventually.have.deep.property('email', u.email);
      });
    });

    it('should handle chained promises', function() {
      var User = tacit.Model('users');
      var email = 'updated@example.com';
      var user = new User({email: 'new@example.com'});
      return user.save().then(function(u) {
        u.email = email;
        return u.save();
      })
      .then(function(user) {
        return expect(user).to.have.deep.property('email', email);
      });
    });
  });
});
