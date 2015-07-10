var chai           = require("chai"),
    expect         = chai.expect,
    chaiAsPromised = require("chai-as-promised"),
    connection     = require("./connection"),
    tacit          = require("../lib/tacit")(connection);

chai.use(chaiAsPromised);

var Tables = {
  USERS: "users"
};

describe("tacit", function() {
  before(function() {
    return tacit.sql("create table users (username nvarchar(max));");
  });

  after(function() {
    return tacit.sql("drop table users;");
  });

  describe(".insert", function() {
    it("should insert a row into the database", function() {
      return expect(
        tacit.insert(Tables.USERS, { username: "test" })
      ).to.eventually.deep.equal([{ username: "test" }]);
    });
  });

  describe(".where", function() {
    before(function() {
      return tacit.insert(Tables.USERS, { username: "where test" });
    });

    it("should select some rows from the database", function() {
      return expect(
        tacit.where(Tables.USERS, "username = @1", "where test")
      ).to.eventually.deep.equal([{ username: "where test" }]);
    });
  });

  describe(".update", function() {
    before(function() {
      return tacit.insert(Tables.USERS, { username: "update me" });
    });

    it("should update a row in the database", function() {
      return expect(
        tacit.update(Tables.USERS, { username: "updated" }, "username = @1", "update me")
      ).to.eventually.deep.equal([{ username: "updated" }]);
    });
  });

  describe(".delete", function() {
    before(function() {
      return tacit.insert(Tables.USERS, { username: "delete me" });
    });

    it("should delete a record from the database", function() {
      return expect(
        tacit.delete(Tables.USERS, "username = @1", "delete me")
      ).to.eventually.deep.equal([{ username: "delete me" }]);
    });
  });

  describe(".execute", function() {
    before(function() {
      return tacit.sql("create procedure dbo.User_Insert @username nvarchar(max) as begin insert into users ( username ) output inserted.* values ( @username ) end;");
    });

    after(function() {
      return tacit.sql("drop procedure User_Insert");
    });

    it("should insert a record into the database using a procedure", function() {
      return expect(
        tacit.execute("User_Insert", { username: "stored procedure" })
      ).to.eventually.deep.equal({ recordsets: [ [ { username: "stored procedure" } ] ], returnValue: 0 });
    });
  });
});
