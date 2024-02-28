import { Schema, model, Document } from "mongoose";
interface Comment {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
const commentSchema = new Schema<Comment>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default model<Comment>("Comment", commentSchema);
