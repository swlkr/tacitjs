var sql = require('tsqljs'),
    q = require('q'),
    mssql = require('mssql'),
    Record = require('./record');

function Model(table, connection, primaryKey) {
  this._table = table;
  this._connection = connection;
  this._primaryKey = primaryKey || 'id';
  this._query = null;
  this._methods = {};
}

Model.createModel = function(table, connection, primaryKey) {

  var model = new Model(table, connection, primaryKey);

  // user's model definition
  var definition = function(attributes) {
    if(attributes === null || typeof(attributes) !== 'object') {
      throw new Error('Cannot build a record for table ' + model._table + ' without an object');
    }

    return new Record(model, attributes);
  };

  definition.define = function(key, fn) {
    model._methods[key] = fn;
  };

  definition.get = function(id) {
    model._query = sql.select().from(model._table).where(model._primaryKey + ' = ?', id);

    var deferred = q.defer();
    model.run().then(function(rows) {
      if(rows.length > 0) {
        deferred.resolve(rows[0]);
      } else {
        deferred.resolve({});
      }
    }, deferred.reject)

    return deferred.promise;
  };

  definition.where = function(str) {
    model._query = sql.select().from(model._table).where.apply(sql, arguments);
    return model;
  };

  return definition;
};

Model.prototype.run = function() {
  var deferred = q.defer();
  var query = this._query;

  this._query = null;

  var model = this;
  mssql.query(this._connection, function(err) {
    if(err) {
      deferred.reject(err);
    }

    var request = new mssql.Request();
    request.query(query.toQuery(), function(err, result) {
      if(err) {
        deferred.reject(err);
      }

      var records = [];
      for(var i = 0; i !== result.rows.length; i++) {
        records.push(new Record(model, result.rows[i]));
      }

      deferred.resolve(records);
    });
  });

  return deferred.promise;
};

module.exports = Model;
