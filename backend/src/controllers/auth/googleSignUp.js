import admin from "../../firebase/admin.js";
import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import user from "../../models/user.js";

export const googleSignup = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No Google token" });
    }

    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);

    // Firebase decoded fields
    const { name, email, picture } = decoded;

    // Find user in DB
    let existingUser = await User.findOne({ email });

    // Create user if first-time Google login
    if (!existingUser) {
      existingUser = await User.create({
        name,
        email,
        photo: picture,
        provider: "google",
      });
    }

    // Create app JWT
    const appToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Set cookie
    res.cookie("token", appToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Respond
    return res.json({
      success: true,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        photo: existingUser.photo,
        isOnboarded: existingUser.isOnboarded || false,
      },
    });
  } catch (error) {
    console.error("Google signup error:", error);
    return res.status(401).json({ message: "Google auth failed" });
  }
};
