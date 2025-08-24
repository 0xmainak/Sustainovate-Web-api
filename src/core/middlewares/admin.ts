import { Response, NextFunction } from "express";

import { AuthRequest } from "./auth"; // your file path

// Admins or moderators
export function requireAdminOrModerator(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  if (!["admin", "moderator"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied: Admins or moderators only" });
  }

  next();
}

// moderators
export function requireModerator(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  if (!["moderator"].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied: moderators only" });
  }

  next();
}
