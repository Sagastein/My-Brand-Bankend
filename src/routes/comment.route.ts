import { Router } from "express";
import commentController from "../controllers/comment.controller";
const router = Router();
router.post("/:blogId", commentController.createComment);
router.get("/:blogId", commentController.getComments);
export { router as commentRouter };
