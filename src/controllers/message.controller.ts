import { Request, Response } from "express";
import messageService from "../service/message.service";

class MessageController {
  async getMessages(req: Request, res: Response) {
    try {
      const messages = await messageService.getMessages();
      return res.json(messages);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await messageService.getMessageById(id);
      return res.json(message);
    } catch (error: any) {
      return res
        .status(error.message === "Invalid message id" ? 400 : 404)
        .json({ message: error.message });
    }
  }

  async createMessage(req: Request, res: Response) {
    try {
      const message = await messageService.createMessage(req.body);
      return res.json(message);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await messageService.updateMessage(id, req.body);
      return res.json(message);
    } catch (error: any) {
      return res
        .status(error.message === "Invalid message id" ? 400 : 404)
        .json({ message: error.message });
    }
  }

  async deleteMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await messageService.deleteMessage(id);
      return res.json(result);
    } catch (error: any) {
      return res
        .status(error.message === "Invalid message id" ? 400 : 404)
        .json({ message: error.message });
    }
  }
}

export default new MessageController();
