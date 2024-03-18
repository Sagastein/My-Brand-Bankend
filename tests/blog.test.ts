import request from "supertest";
import mongoose from "mongoose";
import { configureApp, server } from "../src/server";
import { describe, expect, it, afterAll, beforeEach } from "@jest/globals";
import blogModel, { Blog } from "../src/models/blog.model";
import { Response } from "supertest";

const app = configureApp();
let token: string | undefined;
describe("Blog API endpoints", () => {
  let blog: Blog | null = null;

  beforeEach(async () => {
    blog = await blogModel.findOne();
    const loginResponse: Response = await request(app)
      .post("/api/v1/users/login")
      .send({ email: "ishimwe@gmail.com", password: "sage123" });

    // Extract the token from the response cookies
    token = loginResponse.body.accessToken;

  });

  it("GET /api/v1/blogs should return all blogs", async () => {
    console.log("Starting Blog API endpoint tests...");
    const response = await request(app).get("/api/v1/blogs");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toMatchObject({
      _id: expect.any(String),
      title: expect.any(String),
      content: expect.any(String),
      image: expect.any(String),
      isPublished: expect.any(Boolean),
      comments: expect.any(Array),
      likes: expect.any(Array),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      __v: expect.any(Number),
    });
  });
  //get blog by invalid blog id
  it("get blog by invalid blog id", async () => {
    const response = await request(app).get("/blogs/invalid");
    expect(response.status).toBe(404);
  });
  it("delete blog by invalid blog id", async () => {
    const response = await request(app).delete("/blogs/invalid");
    expect(response.status).toBe(404);
  });
  it("delete blog by not found blog id", async () => {
    const response = await request(app).delete(
      "/blogs/65ef6a3afc8ace8dbe144fc4"
    );
    expect(response.status).toBe(404);
  });

  it("updates a blog", async () => {
    const newTitle = "Updated Test Blog";

    const response = await request(app)
      .patch(`/api/v1/blogs/${blog?._id}`)
      .set("Authorization", `${token}`)
      .send({
        title: newTitle,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Blog updated successfully");
    expect(response.body.updatedBlog.title).toBe(newTitle);
  });
  it("updates a blog with invalid id", async () => {
    const newTitle = "Updated Test Blog";

    const response = await request(app)
      .patch(`/api/v1/blogs/u484484`)
      .set("Authorization", `${token}`)
      .send({
        title: newTitle,
      });

    expect(response.status).toBe(400);
  });

  test("GET /api/v1/blogs/:id should return single blog", async () => {
    console.log("Testing GET /api/v1/blogs/:id to return single blog...");
    const response = await request(app).get(`/api/v1/blogs/${blog?._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      title: expect.any(String),
      content: expect.any(String),
      image: expect.any(String),
      isPublished: expect.any(Boolean),
      comments: expect.any(Array),
      likes: expect.any(Array),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      __v: expect.any(Number),
    });
  });

  describe("Blog Controller", () => {
    let userToken: string;
    let blogId: string;

    beforeAll(async () => {
      // Create a user
      const userResponse = await request(app).post("/api/v1/users/login").send({
        username: "ishimwe@gmail.com",
        password: "sage123",
        // other user fields...
      });
      userToken = userResponse.body.accessToken;
    });

    it("likes a blog", async () => {
      const response = await request(app)
        .patch(`/api/v1/blogs/like/${blog?._id}`)
        .set("Cookie", [`Authorization=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.blog.likes).toMatchObject(expect.any(Array));
    });
  });
  it("likes a blog invalid", async () => {
    const response = await request(app)
      .patch(`/api/v1/blogs/like/invalid`)
      .set("Cookie", [`Authorization=${token}`]);

    expect(response.status).toBe(400);
  });
   it("likes a blog not found", async () => {
     const response = await request(app)
       .patch(`/api/v1/blogs/like/65eb2add4b6242a7f475b9d3`)
       .set("Cookie", [`Authorization=${token}`]);

     expect(response.status).toBe(404);
     expect(response.body.message).toEqual("Blog not found");
   });
  //get blog by not found id
  it("find blog by un found id", async () => {
    const response = await request(app).get(
      "/api/v1/blogs/65ef688078210a4200c1b3c1"
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Blog not found");
  });
  it("find blog by un invalid id", async () => {
    const response = await request(app).get("/api/v1/blogs/invalid");
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Invalid blog ID");
  });
  it("delete blog by un invalid id", async () => {
    const response = await request(app)
      .delete("/api/v1/blogs/invalid")
      .set("Cookie", [`Authorization=${token}`]);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Invalid blog ID");
  });
  it("delete blog by un un found id", async () => {
    const response = await request(app)
      .delete("/api/v1/blogs/65eb2add4b6242a7f475b9d3")
      .set("Cookie", [`Authorization=${token}`]);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Blog not found");
  });
  it("create blog invalid input", async () => {
    const response = await request(app)
      .post("/api/v1/blogs")
      .set("Cookie", `Authorization=${token}`)
      .send({
        image: "",
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  it("create blog missing image", async () => {
    const response = await request(app)
      .post("/api/v1/blogs")
      .set("Cookie", `Authorization=${token}`)
      .send({
        content: "saga code is good",
        title: "saga code in the night"
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  //get popular blog posts
  it("GET /api/v1/blogs/popular should return popular blogs", async () => {
    console.log("Testing GET /api/v1/blogs/popular to return popular blogs...");
    const response = await request(app)
      .get(`/api/v1/blogs/popular`)
      .set("Cookie", [`Authorization=${token}`]);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toMatchObject({
      _id: expect.any(String),
      title: expect.any(String),
      content: expect.any(String),
      image: expect.any(String),
      isPublished: expect.any(Boolean),
      comments: expect.any(Array),
      likes: expect.any(Array),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      __v: expect.any(Number),
    });
   
  });
describe("Blog dashboard", () => {
  it("gets popular blogs", async () => {
    const response = await request(app).get("/api/v1/blogs/popular").set("Cookie", [`Authorization=${token}`]);;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // replace 'title', 'content', etc. with your actual blog fields
          title: expect.any(String),
          content: expect.any(String),
          likes: expect.any(Array),
          // ...
        }),
      ])
    );
  });

  it("gets blog stats", async () => {
    const response = await request(app).get("/api/v1/blogs/stats");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        totalBlogs: expect.any(Number),
        totalComments: expect.any(Number),
        totalUsers: expect.any(Number),
      })
    );
  });
});
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
});
