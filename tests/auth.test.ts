import request from "supertest";
import mongoose from "mongoose";
import { configureApp, server } from "../src/server";
import { describe, expect, it, afterAll } from "@jest/globals";
import userModel, { User } from "../src/models/user.model";
import { checkAuth } from "../src/middleware/auth.middleware";

const app = configureApp();

describe("GET /api/v1/users", () => {
  let user: User | null;

  beforeEach(async () => {
    user = await userModel.findOne();
  });

  it("should return 401 if no token is provided", async () => {
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
    const validToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJfaWQiOiI2NWRlNGNlZWU3NmQzNmY2YTNmNDAxYjYiLCJmdWxsTmFtZSI6ImlzaGltd2Ugc2FnZSIsImVtYWlsIjoiaXNoaW13ZUBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6OTg0OTM0ODkzNDMsImltYWdlIjoiaHR0cHM6Ly93d3cuZ3JhdmF0YXIuY29tL2F2YXRhci8iLCJyb2xlIjoiYWRtaW4iLCJjcmVhdGVkQXQiOiIyMDI0LTAyLTI3VDIwOjU4OjIyLjc5MloiLCJ1cGRhdGVkQXQiOiIyMDI0LTAyLTI3VDIwOjU4OjIyLjc5MloiLCJ1c2VybmFtZSI6ImlzaGltd2U2OTE5IiwiX192IjowfSwiaWF0IjoxNzA5ODkxODg1LCJleHAiOjE3MDk5Mjc4ODV9.zdhUOjk1Zv9blwoDqT4-9LIFijzVLi6UtxOWAu8eliE";

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
