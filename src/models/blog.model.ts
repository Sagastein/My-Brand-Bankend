// blogs model

import { Schema, Document, model } from "mongoose";

export interface Blog {
  _id: Schema.Types.ObjectId;
  title: string;
  content: string;
  image: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  comments: Schema.Types.ObjectId[] | Comment[];
  likes: Schema.Types.ObjectId[]; // References to Users who liked
}

// interface Comment {
//   _id: Schema.Types.ObjectId;
//   user: Schema.Types.ObjectId; // References to User
//   content: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

const blogSchema = new Schema<Blog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: async function (v: Schema.Types.ObjectId) {
          const user = await model("User").findById(v);
          return user !== null;
        },
        message: (props: { value: Schema.Types.ObjectId }) =>
          `User with id ${props.value} does not exist`,
      },
    },
  ],
});

export default model<Blog>("Blog", blogSchema);
