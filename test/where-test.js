var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    config = require('./config'),
    tacit = require('../lib/tacit')(config);

chai.use(chaiAsPromised);

describe('Model', function() {
  describe('.where', function() {
    var User = tacit.Model('users');

    before(function() {
      return tacit.Query("create table users (id int primary key identity(1,1), email nvarchar(256) unique, job nvarchar(256) null, name nvarchar(256) null)").then(function(result) {
        return tacit.Query("insert into users (email, name, job) values ('test@test.com', 'steve', null), ('test@example.com', 'steve', 'software engineer'), ('test1@example.com', 'steve', 'software engineer')");
      });
    });

    after(function() {
      return tacit.Query('drop table users');
    });

    it('should retrieve records meeting the given criteria', function() {
      return expect(User.where('email = ?', 'test@example.com').run()).to.eventually.have.length(1);
    });

    it('should handle multiple parameters in the where clause', function() {
      return expect(User.where('name = ? and job = ?', 'steve', 'software engineer').run()).to.eventually.have.length(2);
    });
  });
});
