import userModel, { User } from "../models/user.model";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class UserService {
  async getUsers() {
    return await userModel.find();
  }

  async getUserById(id: string) {
    // if id is not type of mongoose objectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user id");
    }
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createUser(userData: User) {
    const emailExists = await userModel.findOne({ email: userData.email });
    if (emailExists) {
      throw new Error("Email already exists");
    }
    const phoneNumberExists = await userModel.findOne({
      phoneNumber: userData.phoneNumber,
    });
    if (phoneNumberExists) {
      throw new Error("Phone number already exists");
    }
    const user = new userModel(userData);
    await user.save();
    return user;
  }

  async updateUser(id: string, userData: User) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user id");
    }
    const user = await userModel.findByIdAndUpdate(id, userData, {
      new: true,
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async deleteUser(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user id");
    }
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      throw new Error("User not found");
    }
    return { message: "User has been deleted" };
  }

  async login(email: string, password: string) {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("user not found");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const userWithoutPassword: any = user.toObject();
    delete userWithoutPassword.password;

    const accessToken = Jwt.sign(
      { userData: userWithoutPassword },
      process.env.JWT_SECRET ?? "",
      { expiresIn: "10h" }
    );
    return {
      message: "Authorized",
      user: userWithoutPassword,
      accessToken,
    };
  }
}

export default new UserService();
