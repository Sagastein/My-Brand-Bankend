//message schema

import { Schema, Document, model } from "mongoose";

interface Message extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<Message>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model<Message>("Message", messageSchema);
