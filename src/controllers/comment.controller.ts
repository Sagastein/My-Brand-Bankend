import { NextFunction, Request, Response } from "express";
import commentService from "../service/comment.service";

class CommentController {
  async createComment(req: Request, res: Response) {
    try {
      const blogId = req.params.blogId;
      const { content, user } = req.body;

      const newComment = await commentService.createComment(blogId, {
        content,
        user,
      });

      res
        .status(201)
        .json({ message: "Comment created successfully", comment: newComment });
    } catch (error: any) {
      if (error.message === "Invalid blog ID") {
        return res.status(400).json({ message: error.message });
      } else if (error.message === "Missing required field: content") {
        return res.status(400).json({ message: error.message });
      } else if (error.message === "Blog not found") {
        return res.status(404).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getComments(req: Request, res: Response) {
    try {
      const blogId = req.params.blogId;
      const comments = await commentService.getComments(blogId);
      res.status(200).json({ comments });
    } catch (error: any) {
      if (error.message === "Invalid blog ID") {
        return res.status(400).json({ message: error.message });
      } else if (error.message === "Blog not found") {
        return res.status(404).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId;
      const result = await commentService.deleteComment(commentId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Invalid comment ID") {
        return res.status(400).json({ message: error.message });
      } else if (error.message === "Comment not found") {
        return res.status(404).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new CommentController();
