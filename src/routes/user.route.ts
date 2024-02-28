import userController from "../controllers/user.controller";
import { Router } from "express";
import { schemas, validateSchema } from "../validation/SchemaValidation";

const router = Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post(
  "/",
  validateSchema(schemas.userSchema.create),
  userController.createUser
);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
export { router as UserRouter };
