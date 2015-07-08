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
          mssql.close();
          callback(queryError, rows || []);
        });
      }
    });
  }
};

module.exports = database;
