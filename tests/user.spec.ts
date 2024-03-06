import request from "supertest";
import { testServer } from "../src/server";
import mongoose from "mongoose";
import { describe, expect, test, it, afterAll } from "@jest/globals";

const app = testServer;
describe("with valid credentials", () => {
  test("should return 200 and authorized message", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      email: "user@gmail.com",
      password: "sage123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toBe("string");
  });
});

//test a middle ware for check if admin
describe("with valid credentials", () => {
  it("should return 200 and authorized message", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      email: "",
      password: "sage123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toBe("string");
  }
  )
})

afterAll(async () => {
  await mongoose.connection.close();
  app.close();
});
