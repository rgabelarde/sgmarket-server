// const chai = require("chai");
// const crypto = require("crypto");
// const chaiHttp = require("chai-http");
// const server = require("../bin/www");

// chai.use(chaiHttp);
// chai.should();

// describe("User Controller Tests", () => {
//   const newUser = {
//     username: "testUser" + Math.round(Math.random() * 100000),
//     email: Math.round(Math.random() * 100000) + "@email.com",
//     uuid: crypto.randomUUID(),
//   };

//   console.log(newUser);
//   it("should create a new user", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/onboard")
//       .send(newUser)
//       .end((err, res) => {
//         res.should.have.status(201);
//         res.body.should.be.a("object");
//         done();
//       });
//   });

//   it("should get a user by UUID", (done) => {
//     chai
//       .request(server)
//       .get("/api/user/view/uuid/" + newUser.uuid)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a("object");
//         done();
//       });
//   });

//   it("should return 404 when getting a user by non-existing UUID", (done) => {
//     chai
//       .request(server)
//       .get("/api/user/view/uuid/nonexistentuuid")
//       .end((err, res) => {
//         res.should.have.status(404);
//         done();
//       });
//   });

//   it("should return 500 when creating a user with invalid data", (done) => {
//     const invalidUser = {
//       username: "test user", // Invalid username with space
//       email: "invalidemail", // Invalid email
//       biometricVerified: "yes", // Invalid biometricVerified value
//       flags: -1, // Invalid flags value
//       uuid: crypto.randomUUID(), // Existing UUID
//     };

//     chai
//       .request(server)
//       .post("/api/user/onboard")
//       .send(invalidUser)
//       .end((err, res) => {
//         res.should.have.status(500);
//         done();
//       });
//   });

//   it("should update a user by UUID with partial data", (done) => {
//     const newUserName = "testUser" + Math.round(Math.random() * 100000);
//     chai
//       .request(server)
//       .patch("/api/user/update/" + newUser.uuid)
//       .send({
//         username: newUserName,
//       })
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a("object");
//         done();
//       });
//   });

//   it("should update a user by UUID", (done) => {
//     const updatedUser = {
//       username: "testUser" + Math.round(Math.random() * 100000),
//       email: Math.round(Math.random() * 100000) + "@email.com",
//     };

//     chai
//       .request(server)
//       .patch("/api/user/update/" + newUser.uuid)
//       .send(updatedUser)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a("object");
//         done();
//       });
//   });

//   it("should return 404 when updating a non-existing user by UUID", (done) => {
//     const updatedUser = {
//       username: "newusername",
//       email: "newemail@example.com",
//     };

//     chai
//       .request(server)
//       .patch("/api/user/update/nonexistentuuid")
//       .send(updatedUser)
//       .end((err, res) => {
//         res.should.have.status(404);
//         done();
//       });
//   });

//   it("should return 400 when updating a user with an invalid UUID", (done) => {
//     const updatedUser = {
//       username: "newusername",
//     };

//     chai
//       .request(server)
//       .patch("/api/user/update/invaliduuid")
//       .send(updatedUser)
//       .end((err, res) => {
//         res.should.have.status(404);
//         done();
//       });
//   });

//   it("should return 404 when deleting a non-existing user by UUID", (done) => {
//     chai
//       .request(server)
//       .delete("/api/user/delete/nonexistentuuid")
//       .end((err, res) => {
//         res.should.have.status(404);
//         done();
//       });
//   });

//   it("should delete a user by UUID", (done) => {
//     chai
//       .request(server)
//       .delete("/api/user/delete/" + newUser.uuid)
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   });
// });
