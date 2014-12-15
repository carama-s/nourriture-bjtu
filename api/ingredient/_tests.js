var chai = require("chai");
chai.should();
var mongoose = require("mongoose");
var Ingredient = mongoose.models.Ingredient;
var GridFile = mongoose.models.GridFile;
var conn = mongoose.connection;
var async = require("async");
var request = require("supertest");
var app = require("../../app.js");

describe("User", function() {
  describe("Create and remove photo", function() {
    before("clean the DB", function(done) {
      conn.db.dropDatabase(function(err) {
        if (err) return done(err);
        done();
      });
    });

    it("Create and remove photo", function(done) {
      var p = new GridFile({path: "/test.txt"});
      p.save(function(err, p) {
        if (err) return done(err);
        var i = new Ingredient({name: "test", photo: p});
        i.save(function(err, i) {
          if (err) return done(err);
          var pp = new GridFile({path: "test2.txt"});
          pp.save(function(err, pp) {
            if (err) return done(err);
            i.changePhoto(pp._id)
              .then(function() {
                i.save(function(err, i) {
                  if (err) return done(err);
                  GridFile.count(function(err, count) {
                    if (err) return done(err);
                    count.should.equal(1);
                    done();
                  });
                });
              }, done);
          });
        });
      });
    });
  });
});
