import { NextFunction, Request, Response } from "express";
import blogService from "../service/blog.service";
import { schemas } from "../validation/SchemaValidation";
import { User } from "../models/user.model";

class BlogController {
  async getBlogs(req: Request, res: Response) {
    try {
      const blogs = await blogService.getBlogs();
      res.json(blogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getBlogById(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      const blog = await blogService.getBlogById(blogId);
      res.json(blog);
    } catch (error: any) {
      if (error.message === "Invalid blog ID") {
        return res.status(400).json({ message: error.message });
      } else if (error.message === "Blog not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = schemas.blogSchema.create.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const newBlog = await blogService.createBlog(req.body, uploadedFile);
      res.status(201).json({ message: "Blog created successfully", newBlog });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async deleteBlog(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      const result = await blogService.deleteBlog(blogId);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Invalid blog ID") {
        return res.status(400).json({ message: error.message });
      } else if (error.message === "Blog not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      const { error, value } = schemas.blogSchema.update.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const uploadedFile = req.file;
      const updatedBlog = await blogService.updateBlog(
        blogId,
        req.body,
        uploadedFile
      );
      res.json({ message: "Blog updated successfully", updatedBlog });
    } catch (error: any) {
      if (error.message === "Invalid blog ID") {
        return res.status(400).json({ message: error.message });
      } else if (error.message === "Blog not found") {
        return res.status(404).json({ message: error.message });
      } else if (error.message === "Image upload failed") {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async toggleLike(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      const userId = (req.user as User)._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await blogService.toggleLike(blogId, userId);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Invalid blog ID") {
        return res.status(400).json({ message: error.message });
      } else if (error.message === "Blog not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new BlogController();
