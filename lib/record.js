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

  if(this._isNew) {
    query = sql.insert(this._model._table, this._attributes).output().toQuery();
  } else {
    var changed = diff(this._attributes, this);
    query = sql.update(this._model._table, changed).where(this._model._primaryKey + ' = ?', this[this._model._primaryKey]).output().toQuery();
  }

  var model = this._model;
  var deferred = q.defer();
  mssql.connect(model._connection, function(err) {
    if(err) {
      deferred.reject(err);
    }

    var request = new mssql.Request();
    request.query(query, function(err, result) {
      if(err) {
        deferred.reject(err);
      }

      deferred.resolve(new Record(model, result.rows[0]));
    });
  });

  return deferred.promise;
};

Record.prototype.destroy = function () {
  var query = sql.delete(this._model._table).where(this._model._primaryKey + ' = ?', this[this._model._primaryKey]).toQuery();

  var model = this._model;
  var deferred = q.defer();
  mssql.connect(model._connection, function(err) {
    if(err) {
      deferred.reject(err);
    }

    var request = new mssql.Request();
    request.query(query, function(err, result) {
      if(err) {
        deferred.reject(err);
      }

      deferred.resolve(result.rowCount === 1);
    });
  });

  return deferred.promise;
};

function diff(obj1, obj2) {
  var changed = {};

  for(var key in obj1) {
    if(obj1[key] !== obj2[key]) {
      changed[key] = obj2[key];
    }
  }

  return changed;
}

module.exports = Record;
