import messageModel from "../models/message.model";
import { Request, Response } from "express";
import mongoose from "mongoose";
class MessageController {
  async getMessages(req: Request, res: Response) {
    try {
      const messages = await messageModel.find();
      return res.json(messages);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  async getMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid message id" });
      }
      const messageExists = await messageModel.findById(id);
      if (!messageExists) {
        return res.status(404).json({ message: "Message not found" });
      }
      const message = await messageModel.findById(id);
      return res.json(message);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  async createMessage(req: Request, res: Response) {
    try {
      const message = new messageModel(req.body);
      await message.save();
      return res.json(message);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  // async updateMessage(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     if (!mongoose.Types.ObjectId.isValid(id)) {
  //       return res.status(400).json({ message: "Invalid message id" });
  //     }
  //     const messageExists = await messageModel.findById(id);
  //     if (!messageExists) {
  //       return res.status(404).json({ message: "Message not found" });
  //     }
  //     const message = await messageModel.findByIdAndUpdate(id, req.body, {
  //       new: true,
  //     });
  //     return res.json(message);
  //   } catch (error: any) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // }
  async deleteMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid message id" });
      }
      const messageExists = await messageModel.findById(id);
      if (!messageExists) {
        return res.status(404).json({ message: "Message not found" });
      }
      await messageModel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
export default new MessageController();
