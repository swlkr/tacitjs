var q = require('q'),
    mssql = require('mssql'),
    Model = require('./model');

module.exports = function(connection) {
  return {
    Model: function(table, primaryKey) {
      return Model.createModel(table, connection, primaryKey);
    },
    Query: function(query) {
      var deferred = q.defer();
      mssql.connect(connection, function(err) {
        if(err) {
          deferred.reject(err);
        }

        var request = new mssql.Request();
        request.query(query, function(err, records) {
          if(err) {
            deferred.reject(err);
          }

          deferred.resolve(records);
        });
      });

      return deferred.promise;
    }
  };
};
