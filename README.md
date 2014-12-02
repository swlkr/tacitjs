# Tacit
_A minimal mssql ORM for nodejs_

Built on top of [mssql](https://github.com/patriksimek/node-mssql) and [tsqljs](https://github.com/swlkr/tsqljs)

## Examples

```bash
# Install the module
$ npm install --save tacitjs
```

```js
// Require the module
var tacit = require('tacit')({
  server: 'localhost',
  user: 'enterprise-admin',
  password: 'enterprise-password',
  database: 'tacitjs'
});
```

```sql
// Create a table
CREATE TABLE users
(
  id INT PRIMARY KEY IDENTITY(1,1),
  username NVARCHAR(256),
  email NVARCHAR(256),
  createdAt NOT NULL CONSTRAINT DF_MyTable_CreateDate_GETDATE DEFAULT GETDATE()
)
```

```js
// Define a model
var User = tacit.Model('users');

// Define a model with a primary key other than id
var User = tacit.Model('users', 'userId');

// Insert a record
var user = new User({email: 'test@example.com'});
user.save()
.then(function(result) {
  /*
  result = {
    id: '1',
    email: 'test@example.com',
    createdat: Sun Sep 14 2014 23:03:13 GMT-0700 (PDT)
  }
  */
})
.fail(function(error) {
  console.log(error);
})

// Find a record by primary key (id by default)
User.get(1)
.then(function(result) {
  /*
  result = {
    id: '1',
    email: 'test@example.com',
    createdat: Sun Sep 14 2014 23:03:13 GMT-0700 (PDT)
  }
  */
})
.fail(function(error) {
  console.log(error);
})

// Find a record using where
User.where('email = ?', 'test@example.com').run()
.then(function(result) {
  /*
    result = [{
      id: '1',
      email: 'test@example.com',
      createdat: Sun Sep 14 2014 23:03:13 GMT-0700 (PDT)
    }]
  */
})
.fail(function(error) {
  console.log(error);
})
```

## Tests

```sql
// Grab a sql server database (appharbor has a free one)
$ env SERVER=<server name> DATABASE=<database name> USER_ID=<User Id> PASSWORD=<Password> mocha
```

## What's with the name?

Relational database transactions are guaranteed through ACID, and tacit kind of
sounds like acid... just... don't worry about it.
