import userController from "../controllers/user.controller";
import { Router } from "express";
import { schemas, validateSchema } from "../validation/SchemaValidation";
import { checkAuth, checkAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", checkAuth, checkAdmin, userController.getUsers);
router.get("/:id", userController.getUser);
router.post(
  "/",
  validateSchema(schemas.userSchema.create),
  userController.createUser
);
router.put(
  "/:id",
  checkAuth,
  validateSchema(schemas.userSchema.update),
  userController.updateUser
);
router.delete("/:id", checkAuth, userController.deleteUser);
router.post(
  "/login",
  validateSchema(schemas.userSchema.login),
  userController.Login
);
router.patch("/status/:id", checkAuth, userController.toggleUserStatus);
export { router as UserRouter };
