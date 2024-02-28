import { Router } from "express";
import messageController from "../controllers/message.controller";
import { schemas, validateSchema } from "../validation/SchemaValidation";
const router = Router();
router
  .get("/", messageController.getMessages)
  .get("/:id", messageController.getMessage)
  .post(
    "/",
    validateSchema(schemas.messageSchema.create),
    messageController.createMessage
  )
  .delete("/:id", messageController.deleteMessage);
export { router as MessageRouter };
