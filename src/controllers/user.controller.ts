import { Request, Response } from "express";
import userService from "../service/user.service";
import userModel from "../models/user.model";
import mongoose from "mongoose";

class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.getUsers();
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      return res.json(user);
    } catch (error: any) {
      return res
        .status(error.message === "Invalid user id" ? 400 : 404)
        .json({ message: error.message });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.updateUser(id, req.body);
      return res.json(user);
    } catch (error: any) {
      return res
        .status(error.message === "Invalid user id" ? 400 : 404)
        .json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      return res.json(result);
    } catch (error: any) {
      return res
        .status(error.message === "Invalid user id" ? 400 : 404)
        .json({ message: error.message });
    }
  }
  async toggleUserStatus(req: Request, res: Response) {
    let message = "";
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const userExists = await userModel.findById(id);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
      const user = await userModel.findById(id);
      if (user && user.status === "active") {
        user.status = "blocked";
        message = "User blocked successfully";
      } else if (user) {
        user.status = "active";
        message = "User activated successfully";
      }
      await user?.save();
      return res.status(200).json({ message: message, user });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  async Login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      return res
        .cookie("Authorization", result.accessToken, {
          httpOnly: true,
          maxAge: 60 * 600 * 1000,
        })
        .status(200)
        .json(result);
    } catch (error: any) {
      return res
        .status(error.message === "User not found" ? 400 : 401)
        .json({ message: error.message });
    }
  }
}

export default new UserController();
