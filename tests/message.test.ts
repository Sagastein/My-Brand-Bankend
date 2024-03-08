import request from "supertest";
import mongoose from "mongoose";
import { configureApp, server } from "../src/server";
import { describe, expect, it, afterAll } from "@jest/globals";
import messageSchema from "../src/models/message.model";
import { checkAuth } from "../src/middleware/auth.middleware";
import { Response } from "supertest";

const app = configureApp();
let token: string | undefined;

beforeAll(async () => {
  // Connect to the test database

  // Authenticate as an admin user and get a JWT token
  const loginResponse: Response = await request(app)
    .post("/api/v1/users/login")
    .send({ email: "ishimwe@gmail.com", password: "sage123" });

  // Extract the token from the response cookies
  token = loginResponse.body.accessToken;
  console.log(token);
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

// Add more test cases for other routes...

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
