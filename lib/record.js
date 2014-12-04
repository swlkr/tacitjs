var sql = require('tsqljs'),
    q = require('q'),
    mssql = require('mssql');

function Record(model, attributes) {
  this._attributes = attributes || {};
  this._model = model;

  for(var key in this._attributes) {
    this[key] = this._attributes[key];
  }

  var keys = Object.keys(this._attributes);
  this._isNew = keys.indexOf(model._primaryKey) === -1;

  for(var key in model._methods) {
    if (this[key] === undefined) {
      this[key] = model._methods[key];
    }
  }
}

Record.prototype.save = function() {
  var query = {};
  var model = this._model;

  if(this._isNew) {
    query = sql.insert(model._table, this._attributes).output().toQuery();
  } else {
    var columns = Object.keys(this._attributes).filter(function(c) { return c !== model._primaryKey });
    var attrs = getAttributes(this, columns);
    query = sql.update(model._table, attrs).output().where(model._primaryKey + ' = ?', this[model._primaryKey]).toQuery();
  }

  var deferred = q.defer();
  mssql.connect(model._connection, function(err) {
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

      mssql.close();
      deferred.resolve(new Record(model, rows[0]));
    });
  });

  return deferred.promise;
};

Record.prototype.destroy = function () {
  var query = sql.delete(this._model._table).output().where(this._model._primaryKey + ' = ?', this[this._model._primaryKey]).toQuery();

  var model = this._model;
  var deferred = q.defer();
  mssql.connect(model._connection, function(err) {
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

      mssql.close();
      deferred.resolve(rows.length === 1);
    });
  });

  return deferred.promise;
};

function getAttributes(obj, columns) {
  var attrs = {};
  for(var key in obj) {
    if(columns.indexOf(key) !== -1) {
      attrs[key] = obj[key];
    }
  }
  return attrs;
}

module.exports = Record;
