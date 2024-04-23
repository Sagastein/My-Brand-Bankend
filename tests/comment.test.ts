import request from "supertest";
import mongoose from "mongoose";
import { configureApp, server } from "../src/server";
import { describe, expect, it, afterAll, beforeEach } from "@jest/globals";
import blogModel, { Blog } from "../src/models/blog.model";
import { Response } from "supertest";

const app = configureApp();

let token: string | undefined;
let blog: Blog | null = null;
let commentId: string;

beforeEach(async () => {
  blog = await blogModel.findOne();
  const loginResponse: Response = await request(app)
    .post("/api/v1/users/login")
    .send({ email: "ishimwe@gmail.com", password: "sage123" });
  token = loginResponse.body.accessToken;
});

describe("comments", () => {
  it("creates a comment", async () => {
    const response = await request(app)
      .post(`/api/v1/comments/${blog?._id}`)
      .set("Cookie", `Authorization=${token}`)
      .send({
        content: "This is a test comment.",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Comment created successfully");
    expect(response.body.comment.content).toBe("This is a test comment.");

    commentId = response.body.comment._id; // save the comment ID for later
  });
  it("should return 404 when deleting a comment with not found id", async () => {
    request(app)
      .delete(`/api/v1/comments/65e1fa27f4edb5115c3f561f`)
      .set("Cookie", `Authorization=${token}`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Comment not found");
      });
  });
  it("creates a comment invalid blog id", async () => {
    const response = await request(app)
      .post(`/api/v1/comments/65e1fa27f4edb5115c3f561e`)
      .set("Cookie", `Authorization=${token}`)
      .send({
        content: "This is a test comment.",
      });

    expect(response.status).toBe(404);
  });
    it("likes a blog", async () => {
      const response = await request(app)
        .patch(`/api/v1/blogs/like/${blog?._id}`)
        .set("Cookie", [`Authorization=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.blog.likes).toMatchObject(expect.any(Array));
    });
  it("pass invalid blog id while creating a comment", async () => {
    const response = await request(app)
      .post(`/api/v1/comments/invalidBlogId`)
      .set("Cookie", `Authorization=${token}`)
      .send({
        content: "This is a test comment.",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid blog ID");
  });
  it("should pass content in the body", async () => {
    const response = await request(app)
      .post(`/api/v1/comments/${blog?._id}`)
      .set("Cookie", `Authorization=${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required field: content");
  });
  it("pass invalid blog id while getting comments", async () => {
    const response = await request(app)
      .post(`/api/v1/comments/invalidBlogId`)
      .set("Cookie", `Authorization=${token}`)
      .send({
        content: "This is a test comment.",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid blog ID");
  });
  it("should get all comments", async () => {
    const response = await request(app)
      .get(`/api/v1/comments/${blog?._id}`)
      .set("Cookie", `Authorization=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.comments.length).toBeGreaterThan(1);
  });
  it("should get 400 while passing invalid blog id", async () => {
    const response = await request(app)
      .get(`/api/v1/comments/65e1fa27f4edb5115c3f561e`)
      .set("Cookie", `Authorization=${token}`);

    expect(response.status).toBe(404);
  });
  it("should get 400 while passing invalid blog id", async () => {
    const response = await request(app)
      .get(`/api/v1/comments/65e1fa27f4edb5115c3f561e`)
      .set("Cookie", `Authorization=${token}`);

    expect(response.status).toBe(404);
  });
  it("blog not found to comment", async () => {
    const response = await request(app)
      .get(`/api/v1/comments/invalid`)
      .set("Cookie", `Authorization=${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid blog ID");
  });
  it("should return 400 when deleting a comment with invalid id", async () => {
    request(app)
      .delete(`/api/v1/comments/invalidId`)
      .set("Cookie", `Authorization=${token}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid comment ID");
      });
  });
});

afterAll(async () => {
  server.close();
  await mongoose.connection.close();
});
