import blogModel from "../models/blog.model";
import { NextFunction, Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import { cloudinary } from "../config/cloudinary";
import { MulterError } from "multer";
import userModel, { User } from "../models/user.model";
import { schemas } from "../validation/SchemaValidation";
import commentModel from "../models/comment.model";
interface UploadError extends MulterError {
  message: string;
}
class BlogController {
  //get all blogs
  async getBlogs(req: Request, res: Response) {
    try {
      const blogs = await blogModel.find();
      res.status(200).json(blogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  async getBlogById(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      const blog = await blogModel.findById(blogId).populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
          select: "username email image", // replace 'User' with your actual User model name
        },
      });
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
      const { error, value } = schemas.blogSchema.create.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
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
      const { error, value } = schemas.blogSchema.update.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
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

  async toggleLike(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      const userId = req.user?._id;

      const blog = await blogModel.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      const userIndex = blog.likes.indexOf(userId);
      if (userIndex !== -1) {
        blog.likes.splice(userIndex, 1);
      } else {
        blog.likes.push(userId);
      }

      await blog.save();

      res.json({
        message:
          userIndex !== -1
            ? "Blog unliked successfully"
            : "Blog liked successfully",
        blog,
      });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  //get popular blogs by likes only three
  async getPopularBlogs(req: Request, res: Response) {
    try {
      const blogs = await blogModel.find().sort({ likes: -1 }).limit(3);
      res.status(200).json(blogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  //get total comments total users total users
  async getBlogStats(req: Request, res: Response) {
    try {
      const totalBlogs = await blogModel.countDocuments();
      const totalComments = await commentModel.countDocuments();
      const totalUsers = await userModel.countDocuments();
      res.status(200).json({ totalBlogs, totalComments, totalUsers });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
export default new BlogController();
