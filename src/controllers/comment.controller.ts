import commentModel from "../models/comment.model";
import mongoose, { ObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import blogModel from "../models/blog.model";
class CommentController {
  async createComment(req: Request, res: Response) {
    try {
      const blogId = req.params.blogId;
      const { content } = req.body;
      const user = req.user?._id;

      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      if (!content) {
        return res
          .status(400)
          .json({ message: "Missing required field: content" });
      }

      const newComment = new commentModel({ content, user }); // Assuming user ID is in req.user

      const blog = await blogModel.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      blog.comments.push(newComment._id as mongoose.ObjectId & Comment);
      await blog.save();

      await newComment.save();
      res
        .status(201)
        .json({ message: "Comment created successfully", comment: newComment });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getComments(req: Request, res: Response) {
    try {
      const blogId = req.params.blogId;
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      const blog = await blogModel.findById(blogId).populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User", // replace 'User' with your actual User model name
        },
      });
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json({ comments: blog.comments });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
      const comment = await commentModel.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      await commentModel.deleteOne({ _id: comment._id });
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default new CommentController();
