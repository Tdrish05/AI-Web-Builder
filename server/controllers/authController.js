import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Helper to set cookie
const setSessionCookie = (res, payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // required for sameSite: "none"
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  });
  return token;
};

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      error: "Name, email and password are required"
    });
    return;
  }

  const trimmedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: trimmedEmail });

  if (existing) {
    return res.status(409).json({
      error: "Email already registered"
    });
  }

  const user = await User.create({
    name,
    email: trimmedEmail,
    password
  });

  const token = setSessionCookie(res, { userId: user._id.toString(), email: user.email });
  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      interests: user.interests
    }
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: "Email and password are required"
    });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = setSessionCookie(res, { userId: user._id.toString(), email: user.email });
  res.status(201).json({
    message: "Logged in successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      interests: user.interests
    }
  });
}

export async function logout(_req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });
  res.json({ success: true });
}

export async function me(req, res) {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user });
}

// POST /api/auth/forgot-password
export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return 200 for security reasons (avoid user enumeration) but let client know email was processed
      res.json({ message: "If that email exists, a reset link has been generated." });
      return;
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    const resetLink = `${req.headers.origin || "http://localhost:5173"}/reset-password/${token}`;
    console.log(`[Password Reset] Simulated Link sent to ${email}: ${resetLink}`);

    res.json({
      message: "Password reset link generated successfully.",
      resetToken: token,
      resetLink // Return reset link so user can test the flow easily without SMTP server setup!
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/auth/reset-password/:token
export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ error: "New password is required" });
    return;
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400).json({ error: "Password reset token is invalid or has expired." });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/auth/profile
export async function updateProfile(req, res) {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { name, bio, interests, profileImage } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (interests !== undefined) user.interests = interests;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        interests: user.interests
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/auth/change-password
export async function changePassword(req, res) {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: "Old password and new password are required" });
    return;
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isValid = await user.comparePassword(oldPassword);
    if (!isValid) {
      res.status(400).json({ error: "Incorrect current password" });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}