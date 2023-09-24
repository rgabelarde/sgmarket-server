const chai = require("chai");
const crypto = require("crypto");
const chaiHttp = require("chai-http");
const app = require("../index");

chai.use(chaiHttp);
chai.should();

describe("User Routes Tests", () => {
  const newUser = {
    username: "testUser" + Math.round(Math.random() * 100000),
    email: Math.round(Math.random() * 100000) + "@email.com",
    uuid: crypto.randomUUID(),
  };

  it("should create a new user", (done) => {
    chai
      .request(app)
      .post("/api/user/onboard")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  it("should return 404 when getting a user by non-existing UUID", (done) => {
    chai
      .request(app)
      .get("/api/user/view/uuid/nonexistentuuid")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should get a user by UUID", (done) => {
    chai
      .request(app)
      .get("/api/user/view/uuid/" + newUser.uuid)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("should return 500 when creating a user with invalid data", (done) => {
    const invalidUser = {
      username: "test user", // Invalid username with space
      email: "invalidemail", // Invalid email
      biometricVerified: "yes", // Invalid biometricVerified value
      flags: -1, // Invalid flags value
      uuid: crypto.randomUUID(), // Existing UUID
    };

    chai
      .request(app)
      .post("/api/user/onboard")
      .send(invalidUser)
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it("should update a user by UUID", (done) => {
    const updatedUser = {
      username: "testUser" + Math.round(Math.random() * 100000),
      email: Math.round(Math.random() * 100000) + "@email.com",
    };

    chai
      .request(app)
      .patch("/api/user/update/" + newUser.uuid)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("should return 404 when updating a non-existing user by UUID", (done) => {
    const updatedUser = {
      username: "testUser" + Math.round(Math.random() * 100000),
      email: Math.round(Math.random() * 100000) + "@email.com",
    };

    chai
      .request(app)
      .patch("/api/user/update/nonexistentuuid")
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should update a user by UUID with partial data", (done) => {
    const updatedUser = {
      username: "testUser" + Math.round(Math.random() * 100000),
    };

    chai
      .request(app)
      .patch("/api/user/update/" + newUser.uuid)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("should return 404 when deleting a non-existing user by UUID", (done) => {
    chai
      .request(app)
      .delete("/api/user/delete/nonexistentuuid")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should delete a user by UUID", (done) => {
    chai
      .request(app)
      .delete("/api/user/delete/" + newUser.uuid)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("should return 404 when updating a user with an invalid UUID", (done) => {
    const updatedUser = {
      username: "newusername",
    };

    chai
      .request(app)
      .patch("/api/user/update/invaliduuid")
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
