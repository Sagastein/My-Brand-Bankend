import { idSchema } from "../validation/SchemaValidation";
import userModel, { User } from "../models/user.model";
import { Request, Response } from "express";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await userModel.find();
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // if id is not type of mongoose objectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const userExists = await userModel.findById(id);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
      const user = await userModel.findById(id);
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  async createUser(req: Request, res: Response) {
    try {
      const { email, phoneNumber } = req.body;
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const phoneNumberExists = await userModel.findOne({ phoneNumber });
      if (phoneNumberExists) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      const user = new userModel(req.body);
      await user.save();
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const userExists = await userModel.findById(id);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
      const user = await userModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const userExists = await userModel.findById(id);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
      await userModel.findByIdAndDelete(id);
      return res.json({ message: "User has been deleted" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }
  async Login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "user not found" });
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const userWithoutPassword: any = user.toObject();
      delete userWithoutPassword.password;

      const accessToken = Jwt.sign(
        { userData: userWithoutPassword },
        process.env.JWT_SECRET ?? "",
        { expiresIn: "10h" }
      );
      return res
        .cookie("Authorization", accessToken, {
          httpOnly: true,
          maxAge: 60 * 600 * 1000,
        })
        .status(200)
        .json({
          message: "Authorized",
          user: userWithoutPassword,
        });
      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}

export default new UserController();
