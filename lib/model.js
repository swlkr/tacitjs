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
    model.run().then(function(records) {
      if(records.length > 0) {
        deferred.resolve(records[0]);
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
  var query = this._query.toQuery();

  this._query = null;

  var model = this;
  mssql.connect(this._connection, function(err) {
    if(err) {
      mssql.close();
      return deferred.reject(err);
    }

    var request = new mssql.Request();
    // Set us up the input params
    for(var i = 0; i !== query.values.length; i++) {
      request.input((i+1).toString(), query.values[i]);
    }

    request.query(query.text, function(err, rows) {
      if(err) {
        mssql.close();
        return deferred.reject(err);
      }

      if(rows === undefined || rows === null) {
        mssql.close();
        return deferred.reject(new Error('No results found'));
      }

      var records = [];
      for(var i = 0; i !== rows.length; i++) {
        records.push(new Record(model, rows[i]));
      }

      mssql.close();
      deferred.resolve(records);
    });
  });

  return deferred.promise;
};

module.exports = Model;
