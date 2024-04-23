// tests/user.spec.ts
import request from "supertest";
import mongoose from "mongoose";
import { configureApp, server } from "../src/server";
import { describe, expect, it, afterAll } from "@jest/globals";
import userModel, { TypeRole, User } from "../src/models/user.model";
import { Response } from "supertest";

const app = configureApp();
let token: string | undefined;
beforeAll(async () => {
  const loginResponse: Response = await request(app)
    .post("/api/v1/users/login")
    .send({ email: "ishimwe@gmail.com", password: "sage123" });

  // Extract the token from the response cookies
  token = loginResponse.body.accessToken;
});
describe("with valid credentials", () => {
  it("should return 200 and welcome message on GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("welcome to sage brand");
  });

  it("should return 404 on unknown routes", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
  });

  it("should return 200 and authorized message", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      email: "user@gmail.com",
      password: "sage123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toBe("string");
  });
});

describe("with invalid credentials", () => {
  it("should return 401 and unauthorized message", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      email: "user@gmail.com",
      password: "password",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
  it("should return 400 if email is missing", async () => {
    const response = await request(app).post("/api/v1/users").send({
      password: "test123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
  it("user not found", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      email: "sagayilajks@gmail.com",
      password: "never give up",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toEqual({ message: "user not found" });
  });
});
let user: User | null;
beforeEach(async () => {
  user = await userModel.findOne();
});
// get all users without admin role get forbidden
it("get all users without admin role", async () => {
  const response = await request(app).get("/api/v1/users");
  expect(response.statusCode).toBe(401);
  expect(response.body).toHaveProperty("message");
});
//invalid user id
it("get user by invalid id", async () => {
  const response = await request(app)
    .get(`/api/v1/users/invalidId`)
    .set("Cookie", `Authorization=${token}`);
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty("message");
});
//user not found
it("get user by not found id", async () => {
  const response = await request(app).get(
    `/api/v1/users/65e1fa27f4edb5115c3f561f`
  );
  expect(response.statusCode).toBe(404);
  expect(response.body).toHaveProperty("message");
});
//create user account  fullName email password phoneNumber
it("create user account", async () => {
  const response = await request(app).post("/api/v1/users").send({
    email: "email@example.co",
    password: "sage123",
    phoneNumber: "123456789",
    fullName: "test user2",
  });
  expect(response.statusCode).toBe(500);
});
//email already exists
it("email already exists", async () => {
  const response = await request(app).post("/api/v1/users").send({
    email: "user@gmail.com",
    password: "sage123",
    phoneNumber: "123456789",
    fullName: "test user2",
  });
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty("message");
});
//phone number already exists
it("phone number already exists", async () => {
  const response = await request(app).post("/api/v1/users").send({
    email: "sdfsad@knklasd.com",
    password: "password",
    phoneNumber: "984432543384",
    fullName: "test user2",
  });
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty("message");
});


//delete user with invalid id
it("delete user with invalid id", async () => {
  const response = await request(app)
    .delete(`/api/v1/users/invalidId`)
    .set("Cookie", `Authorization=${token}`);
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty("message");
});
//delete user but user not found
it("delete user but user not found", async () => {
  const response = await request(app)
    .delete(`/api/v1/users/65de4e1046cb946454e3539b`)
    .set("Cookie", `Authorization=${token}`);
  expect(response.statusCode).toBe(404);
  expect(response.body).toHaveProperty("message");
});
it("get user by id", async () => {
  const response = await request(app).get(`/api/v1/users/${user?._id}`);
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("email");
});

//toggle user status
it("toggle user status", async () => {
  const response = await request(app)
    .patch(`/api/v1/users/status/${user?._id}`)
    .set("Cookie", `Authorization=${token}`);
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("message");
});
it("update user invalid", async () => {
  const response = await request(app)
    .put(`/api/v1/users/invalidId`)
    .set("Cookie", `Authorization=${token}`)
    .send({
      fullName: "saga1",
      PhoneNumber: "437934973498",
    });
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty("message");
});
it("update user not found", async () => {
  const response = await request(app)
    .put(`/api/v1/users/65e1fa27f4edb5115c3f561e`)
    .set("Cookie", `Authorization=${token}`)
    .send({
      fullName: "saga 1sage",
      phoneNumber: "437934973498",
    });
  expect(response.statusCode).toBe(404);
  expect(response.body).toHaveProperty("message");
});

 
describe("User Model", () => {
  // it("hashes the password before saving", async () => {
  //   const password: string = "password123";
  //   const user: User = new userModel({
  //     password: "password123",
  //     phoneNumber: 39743891789+1,
  //     email: "test2@gmail.com",
  //     role: TypeRole.user,
  //     fullName: "test user2",
  //   });

  //   await user.save();

  //   const savedUser: User | null = await userModel.findById(user._id);
  //   expect(savedUser?.password).not.toBe(password);
  // });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
