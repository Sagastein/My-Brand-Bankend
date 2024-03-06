import messageModel from "../models/message.model";
import mongoose from "mongoose";

export class MessageService {
  async getMessages() {
    return await messageModel.find();
  }

  async getMessageById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid message id");
    }
    const message = await messageModel.findById(id);
    if (!message) {
      throw new Error("Message not found");
    }
    return message;
  }

  async createMessage(messageData: any) {
    const message = new messageModel(messageData);
    await message.save();
    return message;
  }

  async updateMessage(id: string, messageData: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid message id");
    }
    const message = await messageModel.findByIdAndUpdate(id, messageData, {
      new: true,
    });
    if (!message) {
      throw new Error("Message not found");
    }
    return message;
  }

  async deleteMessage(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid message id");
    }
    const message = await messageModel.findByIdAndDelete(id);
    if (!message) {
      throw new Error("Message not found");
    }
    return { message: "Message deleted successfully" };
  }
}

export default new MessageService();
