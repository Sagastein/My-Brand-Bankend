import { Router } from "express";
import commentController from "../controllers/comment.controller";
import { checkAuth, checkAdmin } from "../middleware/auth.middleware";
const router = Router();
router.post("/:blogId", checkAuth, commentController.createComment);
router.get("/:blogId", commentController.getComments);
router.delete(
  "/:commentId",
  checkAuth,
  checkAdmin,
  commentController.deleteComment
);
export { router as commentRouter };
