import bcrypt from "bcryptjs";

import User, { IUser } from "./modle";

export async function getAll() {
  return User.find().select("-password"); // hide password field
}

export async function getById(id: string) {
  return User.findById(id).select("-password");
}

export async function create(data: Partial<IUser>) {
  const user = new User(data);
  return user.save();
}

export async function findByEmail(email: string) {
  return User.findOne({ email }).select("-password");
}
export async function findByUsername(username: string) {
  return User.findOne({ username: new RegExp(`^${username}$`, "i") }).select("-password");
}

export async function updateById(id: string, data: Partial<IUser>) {
  return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
}

export async function deleteById(
  id: string,
  options: { password?: string; username?: string; requesterRole?: string },
) {
  const { password, username, requesterRole } = options;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any;

  if (requesterRole === "moderator" || requesterRole === "admin") {
    if (!username) return null;
    user = await User.findOne({ username });
    if (!user) return null;
  } else {
    // Regular user must provide password
    user = await User.findById(id).select("+password");
    if (!user) return null;

    if (!password) return null;

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return null;
  }

  await user.deleteOne();
  return user;
}
