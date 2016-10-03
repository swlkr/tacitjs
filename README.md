# DEPRECATED Use [yepql](https://github.com/swlkr/yepql) instead


# tacit.js
_A simple mssql library_

Built on top of [mssql](https://github.com/patriksimek/node-mssql) and [tsqljs](https://github.com/swlkr/tsqljs)

## Install

```bash
$ npm i --save tacitjs
```

## Examples

```js
// Require the module
var tacit = require('tacitjs')({
  server: 'localhost',
  user: 'enterprise-admin',
  password: 'enterprise-password',
  database: 'enterprise-database'
});
```

```sql
/* Create a table */
CREATE TABLE users
(
  id INT PRIMARY KEY IDENTITY(1,1),
  email NVARCHAR(256),
  createdAt NOT NULL CONSTRAINT DF_MyTable_CreateDate_GETDATE DEFAULT GETDATE()
)
```

## Insert a record

```js
var tables = {
  users: "users"
};

tacit
.insert(tables.users, { email: "test@example.com" })
.then(function(rows) {
  /*
    rows === [
      {
        id: "1",
        email: "test@example.com",
        createdAt: ...
      }
    ]
  */
})
```

## Find a record with a where clause

```js
tacit
.where(tables.users, "id = @1", "1")
.then(function(rows) {
  /*
    rows === [
      {
        id: "1",
        email: "test@example.com",
        createdAt: ...
      }
    ]
  */
});
```

## Update a record

```js
tacit
.update(tables.users, { email: "updated@example.com" }, "id = @1", "1")
.then(function(rows) {
  /*
    rows === [
      {
       id: "1",
       email: "updated@example.com",
       createdAt: ...
      }
    ]
  */
});
```


## Delete a record

```js
tacit
.delete(tables.users, "id = @1", "1")
.then(function(rows) {
  /*
    rows === [
      {
        id: "1",
        email: "updated@example.com",
        createdAt: ...
      }
    ]
  */
]
});
```

## Query with abitrary sql

```js
tacit
.sql("insert into users (email) output inserted.* values (@1)", ["email@example.com"])
.then(function(rows) {
  /*
    rows === [
      {
        id: "2",
        email: "email@example.com",
        createdAt: ...
      }
    ]
  */
});
```

## Execute a stored procedure

```js
tacit
.execute("stored_procedure_name", { param1: "param1", param2: "param2" })
.then(function(result) {
  /*
    result === {
      "recordsets": [ [{ some: "data", maybe: "?" }] ],
      "returnValue": 0
    }
  */
});
```

## Tests

```bash
// Grab a sql server database (appharbor has a free one)
$ git clone git@github.com:swlkr/tacitjs.git
$ npm i
$ touch .env
$ echo "SERVER=<server name>" >> .env
$ echo "DATABASE=<database name>" >> .env
$ echo "USER_ID=<User Id>" >> .env
$ echo "PASSWORD=<Password>" >> .env
$ npm test
```

## What's with the name?

Relational database transactions are guaranteed through ACID, and tacit kind of
sounds like acid... just... don't worry about it.
