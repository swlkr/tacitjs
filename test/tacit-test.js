var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    config = require('./config'),
    tacit = require('../lib/tacit')(config),
    Model = require('../lib/model');

chai.use(chaiAsPromised);

describe('tacit', function() {
  describe('.Model', function() {
    /*var tableName = 'tableName';
    var model = tacit.Model(tableName);

    it('should return a function', function() {
      var type = typeof(model);
      expect(type).to.equal('function');
    });

    it('should set the primary key', function() {
      var model = acid.Model(tableName, 'otherId');
      expect(model.primaryKey).to.equal('otherId');
    });

    it('should set the primary key to id by default', function() {
      var model = acid.Model(tableName);
      expect(model.primaryKey).to.equal('id');
    });*/
  });

  describe('.Query', function() {
    before(function() {
      return tacit.Query('create table customers (name nvarchar(256), age int)').then(function() {
        return tacit.Query("insert into customers (name, age) values ('Johnny', 29)");
      })
    })

    after(function() {
      return tacit.Query('drop table customers');
    });

    it('should execute an arbitrary query', function() {
      return expect(tacit.Query('select * from customers')).to.eventually.deep.equal([ { name: 'Johnny', age: 29 } ]);
    });
  });
});
