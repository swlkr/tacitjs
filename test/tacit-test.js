var chai           = require("chai"),
    expect         = chai.expect,
    chaiAsPromised = require("chai-as-promised"),
    connection     = require("./connection"),
    tacit          = require("../lib/tacit")(connection);

chai.use(chaiAsPromised);

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
        tacit.insert("users", { username: "test" })
      ).to.eventually.deep.equal([{ username: "test" }]);
    });
  });

  describe(".where", function() {
    before(function() {
      return tacit.insert("users", { username: "where test" });
    });

    it("should select some rows from the database", function() {
      return expect(
        tacit.where("users", "username = @1", "where test")
      ).to.eventually.deep.equal([{ username: "where test" }]);
    });
  });

  describe(".update", function() {
    before(function() {
      return tacit.insert("users", { username: "update me" });
    });

    it("should update a row in the database", function() {
      return expect(
        tacit.update("users", { username: "updated" }, "username = @1", "update me")
      ).to.eventually.deep.equal([{ username: "updated" }]);
    });
  });

  describe(".delete", function() {
    before(function() {
      return tacit.insert("users", { username: "delete me" });
    });

    it("should delete a record from the database", function() {
      return expect(
        tacit.delete("users", "username = @1", "delete me")
      ).to.eventually.deep.equal([{ username: "delete me" }]);
    });
  });
});
