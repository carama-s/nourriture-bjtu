var chai = require("chai");
chai.should();
var mongoose = require("mongoose");
var conn = mongoose.connection;

describe("User", function() {
  describe("test", function() {
    before("clean the db", function(done) {
      conn.db.dropDatabase(done);
    });
    it("should be equal 42", function(done) {
      setImmediate(function() {
        var nb = 42;
        nb.should.equal(42);
        done();
      });
    });
  });
});
