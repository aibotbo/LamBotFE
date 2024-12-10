import { UserData } from "stores/userSlice";

export const doesHaveAuthority = (user: UserData) =>
  user.first_name === "admin_root" ||
  user.first_name === "admin" ||
  user.first_name === "leader";

export const isAdmin = (user: UserData) =>
  user.first_name === "admin_root" || user.first_name === "admin";

export const isLeader = (user: UserData) =>
  user.first_name === "leader" ||
  user.first_name === "admin" ||
  user.first_name === "admin_root";
