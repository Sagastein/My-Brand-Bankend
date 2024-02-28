import BlogController from "../controllers/blog.controller";
import { Router } from "express";
import { upload } from "../config/multer";
const router = Router();
router.get("/", BlogController.getBlogs);
router.post("/", upload.single("image"), BlogController.createBlog);
router.get("/:id", BlogController.getBlogById);
router.delete("/:id", BlogController.deleteBlog);
router.patch("/:id", upload.single("image"), BlogController.updateBlog);
router.patch("/like/:id", BlogController.likeBlog);

export { router as blogRouter };
