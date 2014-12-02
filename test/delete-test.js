var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    config = require('./config'),
    tacit = require('../lib/tacit')(config);

chai.use(chaiAsPromised);

describe('Record', function() {
  describe('#destroy', function() {
    before(function() {
      return tacit.Query("create table users (id int primary key identity(1,1), email nvarchar(256) unique not null)");
    });

    after(function() {
      return tacit.Query('drop table users');
    });

    it('should remove a record from the database', function() {
      var User = tacit.Model('users');
      var user = new User({email: 'test@test.com'});
      return user.save().then(function(user) {
        return expect(user.destroy()).to.eventually.equal(true);
      });
    });
  });
});
