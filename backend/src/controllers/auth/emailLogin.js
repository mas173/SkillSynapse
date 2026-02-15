import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const emailLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check if user signed up with Google (no password)
    if (!user.password) {
      return res
        .status(401)
        .json({
          message:
            "This account uses Google sign-in. Please use Google to log in.",
        });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // respond
    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("Email login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
