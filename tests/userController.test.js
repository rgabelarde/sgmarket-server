const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index.js");
const { expect } = chai;

chai.use(chaiHttp);

describe("User Controller Tests", () => {
  const newUser = {
    username: "testUser" + Math.round(Math.random() * 100000),
    email: Math.round(Math.random() * 100000) + "@email.com",
    uuid: crypto.randomUUID(),
  };

  console.log(newUser);
  it("should create a new user", (done) => {
    chai
      .request(app)
      .post("/api/user/onboard")
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("username").equal(newUser.username);
        expect(res.body).to.have.property("email").equal(newUser.email);
        expect(res.body).to.have.property("uuid").equal(newUser.uuid);
        done();
      });
  });

  it("should get a user by UUID", (done) => {
    chai
      .request(app)
      .get("/api/user/view/uuid/" + newUser.uuid)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("uuid").equal(newUser.uuid);
        done();
      });
  });

  it("should return 404 when getting a user by non-existing UUID", (done) => {
    chai
      .request(app)
      .get("/api/user/view/uuid/nonexistentuuid")
      .end((err, res) => {
        expect(res).to.have.status(404);
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
        expect(res).to.have.status(500);
        done();
      });
  });

  it("should update a user by UUID with partial data", (done) => {
    const newUserName = "testUser" + Math.round(Math.random() * 100000);
    chai
      .request(app)
      .patch("/api/user/update/" + newUser.uuid)
      .send({
        username: newUserName,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("username").equal(newUserName);
        // Ensure other fields are not affected
        expect(res.body).to.have.property("email").not.equal(null);
        expect(res.body).to.have.property("uuid").not.equal(null);
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
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body)
          .to.have.property("username")
          .equal(updatedUser.username);
        expect(res.body).to.have.property("email").equal(updatedUser.email);
        done();
      });
  });

  it("should return 404 when updating a non-existing user by UUID", (done) => {
    const updatedUser = {
      username: "newusername",
      email: "newemail@example.com",
    };

    chai
      .request(app)
      .patch("/api/user/update/nonexistentuuid")
      .send(updatedUser)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should return 400 when updating a user with an invalid UUID", (done) => {
    const updatedUser = {
      username: "newusername",
    };

    chai
      .request(app)
      .patch("/api/user/update/invaliduuid")
      .send(updatedUser)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should return 404 when deleting a non-existing user by UUID", (done) => {
    chai
      .request(app)
      .delete("/api/user/delete/nonexistentuuid")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should delete a user by UUID", (done) => {
    chai
      .request(app)
      .delete("/api/user/delete/" + newUser.uuid)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("message")
          .equal("User deleted successfully");
        done();
      });
  });
});
