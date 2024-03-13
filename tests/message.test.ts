import request from "supertest";
import mongoose from "mongoose";
import { configureApp, server } from "../src/server";
import { describe, expect, it, afterAll } from "@jest/globals";
import messageSchema, { Message } from "../src/models/message.model";
import { checkAuth } from "../src/middleware/auth.middleware";
import { Response } from "supertest";

const app = configureApp();
let token: string | undefined;
let message: Message | null = null;

beforeAll(async () => {
  // Connect to the test database

  // Authenticate as an admin user and get a JWT token
  const loginResponse: Response = await request(app)
    .post("/api/v1/users/login")
    .send({ email: "ishimwe@gmail.com", password: "sage123" });

  // Extract the token from the response cookies
  token = loginResponse.body.accessToken;
  message = await messageSchema.findOne();
});

describe("GET /messages", () => {
  it("should return if admin all messages", async () => {
    const response: Response = await request(app)
      .get("/api/v1/messages")
      .set("Cookie", `Authorization=${token}`);

    expect(response.status).toBe(200);
  });
});

it("should return 401 if user is not authenticated", async () => {
  const response: Response = await request(app).get("/api/v1/messages");
  expect(response.status).toBe(401);
});

it("should return 401 if user is not an admin", async () => {
  const response: Response = await request(app)
    .get("/api/v1/messages")
    .set("Cookie", `Authorization=invalidToken`);
  expect(response.status).toBe(401);
});
//get message by id
describe("GET /messages/:id", () => {
  it("should return 404 if message not found", async () => {
    const response: Response = await request(app)
      .get("/api/v1/messages/65e1fa27f4edb5115c3f561f")
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(404);
  });

  it("should return 400 if message id is invalid", async () => {
    const response: Response = await request(app)
      .get("/api/v1/messages/invalidId")
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });
  //get message by id
  it("should return 200 if message is found", async () => {
    const response: Response = await request(app)
      .get(`/api/v1/messages/${message?._id}`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(200);
  });
  it("should return 400 if message is invalid while deleting", async () => {
    const response: Response = await request(app)
      .delete(`/api/v1/messages/65e1fa27f4edb5115c3f561v`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(400);
  });
  it("should return 404 if message is not found while deleting", async () => {
    const response: Response = await request(app)
      .delete(`/api/v1/messages/65eb2a514b6242a7f475b9ce`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(404);
  });
  it("should return 200  deleting", async () => {
    const response: Response = await request(app)
      .delete(`/api/v1/messages/${message?._id}`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Message deleted successfully");
  });
  it("should return 200 if message is not found while deleting", async () => {
    const response: Response = await request(app)
      .delete(`/api/v1/messages/65eb2a514b6242a7f475b9ce`)
      .set("Cookie", `Authorization=${token}`);
    expect(response.status).toBe(404);
  });
  //create message name email subject and message
  describe("POST /messages", () => {
    it("should return 200 if message is created", async () => {
      const response: Response = await request(app)
        .post("/api/v1/messages")
        .send({
          name: "test",
          email: "email@gmail.com",
          subject: "test this is testing",
          message: "test testing before deploying",
        });
      expect(response.status).toBe(200);
    });
  });
});

// Add more test cases for other routes...

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
