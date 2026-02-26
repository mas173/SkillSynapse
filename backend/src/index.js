import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth.route.js";
import connectDB from "./config/db.js";
import router from "./routes/onboarding.route.js";
import tutorRouter from "./routes/tutor.route.js";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["X-Session-Id"],
  })
);

//  ROUTES
app.use("/api/auth", AuthRouter);
app.use("/api/onboarding", router);
app.use("/api/tutor", tutorRouter);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
