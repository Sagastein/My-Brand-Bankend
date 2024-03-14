import request from "supertest";
import mongoose from "mongoose";
import { configureApp, server } from "../src/server";
import { describe, expect, it, afterAll } from "@jest/globals";
import userModel, { User } from "../src/models/user.model";
import dotenv from "dotenv"
dotenv.config();
const app = configureApp();

describe("GET /api/v1/users", () => {
  let user: User | null;

  beforeEach(async () => {
    user = await userModel.findOne();
  });

  it("should return 401 if no token is provided.", async () => {
    const response = await request(app).get("/api/v1/users");
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Unauthorized: No token provided"
    );
  });

  it("should return 401 if an invalid token is provided", async () => {
    const response = await request(app)
      .get("/api/v1/users")
      .set("Cookie", ["Authorization=invalidToken"]);
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Unauthorized: Invalid token"
    );
  });

  it("should return 200 and user data if a valid token is provided", async () => {
    const validToken = process.env.LONG_JWT_KEY;
    const response = await request(app)
      .get("/api/v1/users")
      .set("Cookie", [`Authorization=${validToken}`]);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(expect.any(Array));
  });
  //while loging in the user check if password store in the db is hashed
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
