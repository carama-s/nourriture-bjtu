var chai = require("chai");
chai.should();

describe("User", function() {
  describe("test", function() {
    it("should be equal 42", function(done) {
      setImmediate(function() {
        var nb = 42;
        nb.should.equal(42);
        done();
      });
    });
  });
});
