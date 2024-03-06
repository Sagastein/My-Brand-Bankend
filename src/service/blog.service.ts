import blogModel from "../models/blog.model";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary";
import { User } from "../models/user.model";

export class BlogService {
  async getBlogs() {
    return await blogModel.find();
  }

  async getBlogById(blogId: string) {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      throw new Error("Invalid blog ID");
    }
    const blog = await blogModel.findById(blogId).populate("comments");
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  }

  async createBlog(blogData: any, imageFile: Express.Multer.File) {
    let imageURL: string | undefined;

    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.path);
      imageURL = result.secure_url;
      if (!imageURL) {
        throw new Error("Image upload failed");
      }
    }

    const clearData = { ...blogData, image: imageURL };
    const newBlog = new blogModel(clearData);
    await newBlog.save();
    return newBlog;
  }

  async deleteBlog(blogId: string) {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      throw new Error("Invalid blog ID");
    }
    const blog = await blogModel.findByIdAndDelete(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    return { message: "Blog deleted successfully" };
  }

  async updateBlog(
    blogId: string,
    blogData: any,
    imageFile?: Express.Multer.File
  ) {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      throw new Error("Invalid blog ID");
    }

    let imageURL: string | undefined;

    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.path);
      imageURL = result.secure_url;
      if (!imageURL) {
        throw new Error("Image upload failed");
      }
    }

    const updateData = {
      ...blogData,
      ...(imageURL ? { image: imageURL } : {}),
    };

    const updatedBlog = await blogModel.findByIdAndUpdate(blogId, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      throw new Error("Blog not found");
    }

    return updatedBlog;
  }

  async toggleLike(blogId: string, userId: User["_id"]) {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      throw new Error("Invalid blog ID");
    }

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    const userIndex = blog.likes.indexOf(userId);
    if (userIndex !== -1) {
      blog.likes.splice(userIndex, 1);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    return {
      message:
        userIndex !== -1
          ? "Blog unliked successfully"
          : "Blog liked successfully",
      blog,
    };
  }
}

export default new BlogService();
