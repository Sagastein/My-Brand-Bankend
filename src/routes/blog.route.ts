import BlogController from "../controllers/blog.controller";
import { Router } from "express";
import { upload } from "../config/multer";
import { checkAuth, checkAdmin } from "../middleware/auth.middleware";
const router = Router();
router.get("/", BlogController.getBlogs);
router.post(
  "/",
  checkAuth,
  checkAdmin,
  upload.single("image"),
  BlogController.createBlog
);
router.get("/:id", BlogController.getBlogById);
router.delete("/:id", checkAuth, checkAdmin, BlogController.deleteBlog);
router.patch(
  "/:id",
  checkAuth,
  checkAdmin,
  upload.single("image"),
  BlogController.updateBlog
);
router.patch("/like/:id", checkAuth, BlogController.likeBlog);

export { router as blogRouter };
