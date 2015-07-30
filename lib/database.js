var mssql = require("mssql");

var database = {
  query: function(connection, query, callback) {
    mssql.connect(connection, function(connectionError) {
      if(connectionError) {
        mssql.close();
        callback(connectionError, []);
      } else {

        var request = new mssql.Request();

        // Attach the input params to the request
        var values = query.values || [];
        for(var i = 0; i !== values.length; i++) {
          request.input((i + 1).toString(), query.values[i]);
        }

        request.query(query.text, function(queryError, rows) {
          callback(queryError, rows || []);
        });
      }
    });
  },
  execute: function(connection, name, parameters, callback) {
    mssql.connect(connection, function(connectionError) {
      if(connectionError) {
        mssql.close();
        callback(connectionError, []);
      } else {
        var request = new mssql.Request();

        // Attach input params to the request
        var params = parameters || {};
        var keys = Object.keys(params);
        for(var i = 0; i !== keys.length; i++) {
          var key = keys[i];
          request.input(key, params[key]);
        }

        request.execute(name, function(error, recordsets) {
          callback(error, recordsets || []);
        });
      }
    });
  }
};

module.exports = database;
