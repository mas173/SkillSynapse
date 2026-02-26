import express from "express";
import { emailSignup } from "../controllers/auth/emailsignUp.js";
import { emailLogin } from "../controllers/auth/emailLogin.js";
import { googleSignup } from "../controllers/auth/googleSignUp.js";
import { getMe } from "../controllers/auth/me.js";
import { logout } from "../controllers/auth/logout.js";
import { protect } from "../middlewares/authMiddleware.js";

const Authrouter = express.Router();
Authrouter.post("/emailPass", emailSignup);
Authrouter.post("/emailLogin", emailLogin);
Authrouter.post("/google", googleSignup);
Authrouter.get("/me", protect, getMe);
Authrouter.post("/logout", logout);

export default Authrouter;
