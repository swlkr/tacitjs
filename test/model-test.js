var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    config = require('./config'),
    tacit = require('../lib/tacit')(config),
    Record = require('../lib/record');

chai.use(chaiAsPromised);

describe('Model', function() {
  describe('.new', function() {
    it('should return an instance of a record', function() {
      var User = tacit.Model('users');
      var user = new User({email: 'hello@example.com'});
      expect(user).to.be.an.instanceof(Record);
    });

    it('should create properties', function() {
      var User = tacit.Model('users');
      var user = new User({email: 'hello@example.com'});
      expect(user.email).to.equal('hello@example.com');
    });

    it('should throw an error when given an incorrect input', function() {
      var User = tacit.Model('users');
      var fn = function() { new User(); };
      expect(fn).to.throw('Cannot build a record for table users without an object');
    });
  });

  describe('.get', function() {
    before(function() {
      return tacit.Query("create table users (id int primary key identity(1,1), email nvarchar(256) unique not null)").then(function(result) {
        return tacit.Query("insert into users (email) values ('test@test.com')");
      });
    });

    after(function() {
      return tacit.Query('drop table users');
    });

    it('should get a record from the database', function() {
      var User = tacit.Model('users');
      return expect(User.get(1)).to.eventually.include.keys('email');
    });

    it('should return a sane error message when the record does not exist', function() {
      var User = tacit.Model('users');
      return expect(User.get(2)).to.eventually.deep.equal({});
    })
  });
});
