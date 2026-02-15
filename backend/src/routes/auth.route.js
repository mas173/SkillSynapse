import express from "express";
import { emailSignup } from "../controllers/auth/emailsignUp.js";
import { emailLogin } from "../controllers/auth/emailLogin.js";
import { googleSignup } from "../controllers/auth/googleSignUp.js";

const Authrouter = express.Router();
Authrouter.post("/emailPass", emailSignup);
Authrouter.post("/emailLogin", emailLogin);
Authrouter.post("/google", googleSignup);

export default Authrouter;
