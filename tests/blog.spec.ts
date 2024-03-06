import request from "supertest";
import { testServer } from "../src/server";
import mongoose from "mongoose";
import { describe, expect, test, it, afterAll } from "@jest/globals";
import blogModel, { Blog } from "../src/models/blog.model";
const app = testServer;
describe("GET /blogs", () => {
  it("should return all blogs", async () => {
    const response = await request(app).get("/api/v1/blogs");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("_id");
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("content");
    expect(response.body[0]).toHaveProperty("image");
    expect(response.body[0]).toHaveProperty("isPublished");
    expect(response.body[0]).toHaveProperty("comments");
    expect(response.body[0]).toHaveProperty("likes");
    expect(response.body[0]).toHaveProperty("createdAt");
    expect(response.body[0]).toHaveProperty("updatedAt");
    expect(response.body[0]).toHaveProperty("__v");
  });
});

describe("GET /blog/:id", () => {
  let blog: Blog | null = null;

  // This runs before each test in the describe block
  beforeEach(async () => {
    blog = await blogModel.findOne();
  });
  it("should return single blog", async () => {
    const response = await request(app).get(`/api/v1/blogs/${blog?._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("content");
    expect(response.body).toHaveProperty("image");
    expect(response.body).toHaveProperty("isPublished");
    expect(response.body).toHaveProperty("comments");
    expect(response.body).toHaveProperty("likes");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("__v");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  app.close();
});
