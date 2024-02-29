import { Router } from "express";
import messageController from "../controllers/message.controller";
import { schemas, validateSchema } from "../validation/SchemaValidation";
import { checkAuth, checkAdmin } from "../middleware/auth.middleware";
const router = Router();
router
  .get("/", checkAuth, checkAdmin, messageController.getMessages)
  .get("/:id", checkAuth, checkAdmin, messageController.getMessage)
  .post(
    "/",
    validateSchema(schemas.messageSchema.create),
    messageController.createMessage
  )
  .delete("/:id", checkAuth, checkAdmin, messageController.deleteMessage);
export { router as MessageRouter };
