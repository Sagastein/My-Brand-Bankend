import blogModel from "../models/blog.model";
import { NextFunction, Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import { cloudinary } from "../config/cloudinary";
import { MulterError } from "multer";
interface UploadError extends MulterError {
  message: string;
}
class BlogController {
  //get all blogs
  async getBlogs(req: Request, res: Response) {
    try {
      const blogs = await blogModel.find();
      res.json(blogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  async getBlogById(req: Request, res: Response) {
    try {
      const blogId = req.params.id; // Get blog ID from request parameter

      // Validate blog ID
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      // Fetch the blog with populated comments and likes
      const blog = await blogModel.findById(blogId);

      // Check if blog exists
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json(blog);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body;
      console.log(req.body);
      if (!title || !content) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let imageURL: string | undefined;
      const uploadedFile = req.file;

      if (uploadedFile === undefined) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const result = await cloudinary.uploader.upload(
        (uploadedFile as Express.Multer.File).path
      );
      imageURL = result.secure_url;
      if (!imageURL)
        return res
          .status(400)
          .json({ message: "Image upload failed", imageURL });
      const clearData = { ...req.body, image: imageURL };
      const newBlog = new blogModel(clearData);
      await newBlog.save();
      res.status(201).json({ message: "Blog created successfully", newBlog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
  async deleteBlog(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      const blog = await blogModel.findByIdAndDelete(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      let imageURL: string | undefined;
      const uploadedFile = req.file;

      // Check if image was uploaded, and handle upload and update conditionally
      if (uploadedFile) {
        try {
          const result = await cloudinary.uploader.upload(
            (uploadedFile as Express.Multer.File).path
          );
          imageURL = result.secure_url;
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Image upload failed" });
        }
      }

      const updateData = {
        ...req.body, 
        ...(imageURL ? { image: imageURL } : {}),
      };

      const updatedBlog = await blogModel.findByIdAndUpdate(
        blogId,
        updateData,
        { new: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json({ message: "Blog updated successfully", updatedBlog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async likeBlog(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      const userId = req.body.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const blog = await blogModel.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      if (blog.likes.includes(userId)) {
        blog.likes = blog.likes.filter((id) => id.toString() !== userId);
        await blog.save();
      } else {
        blog.likes.push(userId);
        await blog.save();
      }

      res.json({ message: "Blog liked successfully", blog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default new BlogController();
