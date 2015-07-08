require("dotenv").load();

var connection = {
  server: process.env.SERVER || "f659c50f-e45c-4601-b5d0-a3f401292ea6.sqlserver.sequelizer.com",
  database: process.env.DATABASE || "dbf659c50fe45c4601b5d0a3f401292ea6",
  user: process.env.USER_ID || "rvjtjqaqbpeismqb",
  password: process.env.PASSWORD || "6tWm2VHUVofJFHKMFJNJ5otkCtTUiFwTPVn4yqP3pKagGygCbFViWcgQ8KRGcWLo"
};

module.exports = connection;
