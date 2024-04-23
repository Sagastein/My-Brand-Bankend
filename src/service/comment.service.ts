import commentModel, { Comment } from "../models/comment.model";
import mongoose, { ObjectId } from "mongoose";
import blogModel from "../models/blog.model";

export class CommentService {
  async createComment(
    blogId: string,
    commentData: { content: string; user: ObjectId }
  ) {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      throw new Error("Invalid blog ID");
    }

    if (!commentData.content) {
      throw new Error("Missing required field: content");
    }

    const newComment = new commentModel(commentData);
    const blog = await blogModel.findById(blogId);

    if (!blog) {
      throw new Error("Blog not found");
    }
    let commentsId = newComment._id;

    blog.comments = [...blog.comments, commentsId] as ObjectId[];
    await blog.save();
    await newComment.save();

    return newComment;
  }

  async getComments(blogId: string) {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      throw new Error("Invalid blog ID");
    }

    const blog = await blogModel.findById(blogId).populate("comments");

    if (!blog) {
      throw new Error("Blog not found");
    }

    return blog.comments;
  }

  async deleteComment(commentId: string) {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new Error("Invalid comment ID");
    }

    const comment = await commentModel.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    await commentModel.deleteOne({ _id: comment._id });

    return { message: "Comment deleted successfully" };
  }
}

export default new CommentService();
