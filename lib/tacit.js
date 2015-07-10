var q        = require("q"),
    sql      = require("tsqljs"),
    database = require("./database");

var tacit = function(connection) {
  return {
    insert: function(table, obj) {
      var deferred = q.defer();

      var query = sql.insert(table, obj).output().toQuery();

      database.query(connection, query, function(error, rows) {
        if(error) {
          deferred.reject(error);
        } else {
          deferred.resolve(rows);
        }
      });

      return deferred.promise;
    },
    where: function() {
      var deferred = q.defer();

      var table = [].shift.apply(arguments);

      var query = sql.select().from(table).where.apply(sql, arguments).toQuery();

      database.query(connection, query, function(error, rows) {
        if(error) {
          deferred.reject(error);
        } else {
          deferred.resolve(rows);
        }
      });

      return deferred.promise;
    },
    update: function() {
      var deferred = q.defer();

      var table = [].shift.apply(arguments);
      var obj = [].shift.apply(arguments);

      var query = sql.update(table, obj).output().where.apply(sql, arguments).toQuery();

      database.query(connection, query, function(error, rows) {
        if(error) {
          deferred.reject(error);
        } else {
          deferred.resolve(rows);
        }
      });

      return deferred.promise;
    },
    delete: function() {
      var deferred = q.defer();

      var table = [].shift.apply(arguments);

      var query = sql.delete(table).output().where.apply(sql, arguments).toQuery();

      database.query(connection, query, function(error, rows) {
        if(error) {
          deferred.reject(error);
        } else {
          deferred.resolve(rows);
        }
      });

      return deferred.promise;
    },
    sql: function(text, values) {
      var deferred = q.defer();

      database.query(connection, { text: text, values: values }, function(error, rows) {
        if(error) {
          deferred.reject(error);
        } else {
          deferred.resolve(rows);
        }
      });

      return deferred.promise;
    },
    execute: function(name, params) {
      var deferred = q.defer();

      database.execute(connection, name, params, function(error, recordsets) {
        if(error) {
          deferred.reject(error);
        } else {
          // Hack because console.log was showing weird stuff:
          // [ [{}], returnValue: 0 ]
          var returnValue = recordsets.returnValue;
          delete recordsets.returnValue;

          deferred.resolve({ recordsets: recordsets, returnValue: returnValue });
        }
      });

      return deferred.promise;
    }
  };
};

module.exports = tacit;
