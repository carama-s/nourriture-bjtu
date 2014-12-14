var chai = require("chai");
chai.should();
var mongoose = require("mongoose");
var User = mongoose.models.User;
var conn = mongoose.connection;
var async = require("async");
var request = require("supertest");
var app = require("../../app.js");

describe("User", function() {
  describe("REST", function() {
    var nUser = new User({firstname: "a", lastname: "b", username: "nUser", email: "nUser@example.com", passwd: "test", admin: 10});
    var aUser = new User({firstname: "a", lastname: "b", username: "aUser", email: "aUser@example.com", passwd: "test", admin: 0});
    var testUser = undefined;

    before("clean the DB", function(done) {
      conn.db.dropDatabase(function(err) {
        if (err) return done(err);
        async.parallel([nUser.save.bind(nUser), aUser.save.bind(aUser)], function(err) {
          if (err) return done(err);
          done();
        });
      });
    });

    it("GET /user/", function(done) {
      request(app)
        .get("/user/")
        .expect(200)
        .expect(function(res) {
          res.body.should.be.a("Array");
          res.body.should.have.length(2);
        })
        .end(done);
    });

    it("POST /user/ no auth", function(done) {
      request(app)
        .post("/user/")
        .send({firstname: "a", lastname: "b", username: "test", email: "test@test.com", passwd: "test"})
        .expect(403)
        .end(done);
    });

    it("POST /user/ normal user", function(done) {
      request(app)
        .post("/user/")
        .set("Authorization", "Bearer " + nUser.token.token)
        .send({firstname: "a", lastname: "b", username: "test", email: "test@test.com", passwd: "test"})
        .expect(403)
        .end(done);
    });

    it("POST /user/ admin user", function(done) {
      request(app)
        .post("/user/")
        .set("Authorization", "Bearer " + aUser.token.token)
        .send({firstname: "a", lastname: "b", username: "test", email: "test@test.com", passwd: "test"})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          testUser = new User(res.body);
          done();
        });
    });

    it("GET /user/:oid valid", function(done) {
      request(app)
        .get("/user/" + testUser._id)
        .expect(200)
        .end(done);
    });

    it("GET /user/:oid invalid", function(done) {
      request(app)
      .get("/user/123456789")
      .expect(404)
      .end(done);
    });

    it("PUT /user/:oid no auth", function(done) {
      request(app)
        .put("/user/" + testUser._id)
        .send({username: "toto"})
        .expect(403)
        .end(done);
    });

    it("PUT /user/:oid normal user", function(done) {
      request(app)
        .put("/user/" + testUser._id)
        .set("Authorization", "Bearer " + nUser.token.token)
        .send({username: "toto"})
        .expect(403)
        .end(done);
    });

    it("PUT /user/:oid admin user", function(done) {
      request(app)
        .put("/user/" + testUser._id)
        .set("Authorization", "Bearer " + aUser.token.token)
        .send({username: "toto"})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          testUser = new User(res.body);
          done();
        });
    });

    it("DELETE /user/:oid no auth", function(done) {
      request(app)
        .delete("/user/" + testUser._id)
        .expect(403)
        .end(done);
    });

    it("DELETE /user/:oid normal user", function(done) {
      request(app)
        .delete("/user/" + testUser._id)
        .set("Authorization", "Bearer " + nUser.token.token)
        .expect(403)
        .end(done);
    });

    it("DELETE /user/:oid admin user", function(done) {
      request(app)
        .put("/user/" + testUser._id)
        .set("Authorization", "Bearer " + aUser.token.token)
        .expect(200)
        .end(done);
    });
  });

  describe("Custom routes signup", function() {
    var eUser = new User({firstname: "a", lastname: "b", username: "foo", email: "foo@bar.com", passwd: "foo"});

    before("clean the DB", function(done) {
      conn.db.dropDatabase(function(err) {
        if (err) return done(err);
        eUser.save(done);
      });
    });

    it("/user/signup Missing email", function(done) {
      request(app)
        .post("/user/signup")
        .send({firstname: "a", lastname: "b", username: "test", passwd: "foo"})
        .expect(400)
        .end(done);
    });

    it("/user/signup Missing username", function(done) {
      request(app)
        .post("/user/signup")
        .send({firstname: "a", lastname: "b", email: "test@test.com", passwd: "foo"})
        .expect(400)
        .end(done);
    });

    it("/user/signup Missing passwd", function(done) {
      request(app)
        .post("/user/signup")
        .send({firstname: "a", lastname: "b", username: "test", email: "test@test.com"})
        .expect(400)
        .end(done);
    });

    it("/user/signup Missing firstname", function(done) {
      request(app)
      .post("/user/signup")
      .send({email: "test@test.com", lastname: "b", username: "test", passwd: "foo"})
      .expect(400)
      .end(done);
    });

    it("/user/signup Missing lastname", function(done) {
      request(app)
      .post("/user/signup")
      .send({firstname: "a", email: "test@test.com", username: "test", passwd: "foo"})
      .expect(400)
      .end(done);
    });

    it("/user/signup wrong gender", function(done) {
      request(app)
      .post("/user/signup")
      .send({firstname: "a", lastname: "b", username: "test", email: "test@test.com", passwd: "foo", gender: "wrong"})
      .expect(400)
      .end(done);
    });

    it("/user/signup passwd is empty", function(done) {
      request(app)
        .post("/user/signup")
        .send({firstname: "a", lastname: "b", username: "test", email: "test@test.com", passwd: ""})
        .expect(400)
        .end(done);
    });

    it("/user/signup Email exists", function(done) {
      request(app)
        .post("/user/signup")
        .send({firstname: "a", lastname: "b", username: "test", email: eUser.email, passwd: "foo"})
        .expect(400)
        .end(done);
    });

    it("/user/signup Username exists", function(done) {
      request(app)
        .post("/user/signup")
        .send({firstname: "a", lastname: "b", username: eUser.username, email: "test@test.com", passwd: "foo"})
        .expect(400)
        .end(done);
    });

    it("/user/signup Success", function(done) {
      request(app)
        .post("/user/signup")
        .send({firstname: "a", lastname: "b", username: "test", email: "test@test.com", passwd: "foo"})
        .expect(200)
        .end(done);
    });
  });

  describe("Custom routes get_token, me, update, change_passwd", function() {
    var user = new User({firstname: "a", lastname: "b", username: "user", email: "right@example.com", passwd: "right"});
    var otherUser = new User({firstname: "a", lastname: "b", username: "otherUser", email: "other@example.com", passwd: "right"});

    before("clean the DB", function(done) {
      conn.db.dropDatabase(function(err) {
        if (err) return done(err);
        async.parallel([user.save.bind(user), otherUser.save.bind(otherUser)], function(err) {
          if (err) return done(err);
          done();
        });
      });
    });

    it("/user/get_token Sucess", function(done) {
      request(app)
        .post("/user/get_token")
        .send({email: user.email, passwd: "right"})
        .expect(200)
        .expect(function(res) {
          res.body.should.have.property("token", user.token.token);
        })
        .end(done);
    });

    it("/user/get_token Missing email", function(done) {
      request(app)
        .post("/user/get_token")
        .send({passwd: "right"})
        .expect(400)
        .end(done);
    });

    it("/user/get_token Missing passwd", function(done) {
      request(app)
        .post("/user/get_token")
        .send({email: user.email})
        .expect(400)
        .end(done);
    });

    it("/user/get_token Wrong email", function(done) {
      request(app)
        .post("/user/get_token")
        .send({email: "wrong@example.com", passwd: "right"})
        .expect(400)
        .end(done);
    });

    it("/user/get_token Wrong passwd", function(done) {
      request(app)
        .post("/user/get_token")
        .send({email: user.email, passwd: "wrong"})
        .expect(400)
        .end(done);
    });

    it("/user/me Success", function(done) {
      request(app)
        .get("/user/me")
        .set("Authorization", "Bearer " + user.token.token)
        .expect(200)
        .end(done);
    });

    it("/user/me Error", function(done) {
      request(app)
        .get("/user/me")
        .expect(403)
        .end(done);
    });

    it("/user/change_passwd no Auth", function(done) {
      request(app)
        .post("/user/change_passwd")
        .send({old_passwd: "right", new_passwd: "right"})
        .expect(403)
        .end(done);
    });

    it("/user/change_passwd missing old_passwd", function(done) {
      request(app)
        .post("/user/change_passwd")
        .set("Authorization", "Bearer " + user.token.token)
        .send({new_passwd: "right"})
        .expect(400)
        .end(done);
    });

    it("/user/change_passwd missing new_passwd", function(done) {
      request(app)
        .post("/user/change_passwd")
        .set("Authorization", "Bearer " + user.token.token)
        .send({old_passwd: "right"})
        .expect(400)
        .end(done);
    });

    it("/user/change_passwd wrong passwd", function(done) {
      request(app)
        .post("/user/change_passwd")
        .set("Authorization", "Bearer " + user.token.token)
        .send({old_passwd: "wrong", new_passwd: "right"})
        .expect(400)
        .end(done);
    });

    it("/user/change_passwd Success", function(done) {
      request(app)
        .post("/user/change_passwd")
        .set("Authorization", "Bearer " + user.token.token)
        .send({old_passwd: "right", new_passwd: "foo"})
        .expect(200)
        .end(function(err, res) {
          request(app)
            .post("/user/get_token")
            .send({email: user.email, passwd: "foo"})
            .expect(200)
            .end(done);
        });
    });

    it("/user/update Error", function(done) {
      request(app)
        .post("/user/update")
        .send({username: "lol"})
        .expect(403)
        .end(done);
    });

    it("/user/update Duplicate email", function(done) {
      request(app)
        .post("/user/update")
        .set("Authorization", "Bearer " + user.token.token)
        .send({email: otherUser.email})
        .expect(400)
        .end(done);
    });

    it("/user/update Success", function(done) {
      request(app)
        .post("/user/update")
        .set("Authorization", "Bearer " + user.token.token)
        .send({username: "lol"})
        .expect(200)
        .end(done);
    });
  });
});
