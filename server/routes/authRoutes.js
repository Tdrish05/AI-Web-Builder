import { Router } from "express";
import {
  login,
  logout,
  me,
  register,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", authMiddleware, me);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.put("/profile", authMiddleware, updateProfile);
authRouter.put("/change-password", authMiddleware, changePassword);

export default authRouter;