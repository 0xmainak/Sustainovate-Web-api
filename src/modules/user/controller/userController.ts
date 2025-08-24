import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import * as userService from "../service";
import { AuthRequest } from "../../../core/middlewares/auth";
import User from "../modle";

// GET all users (only role: "user") with public fields
export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find(
      { role: "user" }, // Only users with role "user"
      {
        _id: 1,
        username: 1,
        globalName: 1,
        avatar: 1,
        points: 1,
        email: 1,
      },
    ).lean();

    const publicUsers = users.map((u) => ({
      id: u._id,
      name: u.globalName || u.username.split(" ")[0],
      username: u.username,
      email: u.email || null,
      avatar: u.avatar || "",
      points: u.points ?? 0,
    }));

    res.json({ success: true, data: publicUsers });
  } catch (err) {
    next(err);
  }
}

// GET all users with all fields
export async function getAllUsersData(req: Request, res: Response, next: NextFunction) {
  try {
    let users: unknown = await userService.getAll();
    if (!users) users = [];
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

// GET user by identifier (ID, email, or username)
export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { identifier } = req.params;
    let user = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await userService.getById(identifier);
    }
    if (!user && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      user = await userService.findByEmail(identifier);
    }
    if (!user) {
      user = await userService.findByUsername(identifier);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// Edit user by ID
export async function updateUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const updatedUser = await userService.updateById(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (err) {
    next(err);
  }
}

// Delete user by ID
export async function deleteUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const deletedUser = await userService.deleteById(req.params.id, password);
    if (!deletedUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials or user not found" });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      user: {
        id: deletedUser._id,
        email: deletedUser.email,
        username: deletedUser.username,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET currently logged-in user
export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user._id).select("username email role avatar joined");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
