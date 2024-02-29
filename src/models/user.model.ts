import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
enum TypeRole {
  user = "user",
  admin = "admin",
}
export interface User extends Document {
  fullName: string;
  username?: string;
  email: string;
  phoneNumber: Number;
  image: string;
  password: string;
  role: TypeRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<User>({
  fullName: { type: String, required: true, unique: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  image: { type: String, default: "https://www.gravatar.com/avatar/" },
  role: {
    type: String,
    enum: [TypeRole.user, TypeRole.admin],
    default: TypeRole.user,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
userSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  next();
});
//generate username from fullName some number and save it
userSchema.pre("save", function (next) {
  // Extract first name from fullName
  const firstName = this.fullName.split(" ")[0];
  const random1 = Math.floor(Math.random() * 100);
  const random2 = Math.floor(Math.random() * 100);
  this.username = `${firstName}${random1}${random2}`;

  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password);
};

export default model<User>("User", userSchema);
