import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
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
  }),
);

//  ROUTES
app.use("/api/auth", AuthRouter);
app.use("/api/onboarding", router);
app.use("/api/tutor", tutorRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    // Drop the old unique index on user field if it exists
    try {
      const collection = mongoose.connection.collection("onboardings");
      const indexes = await collection.indexes();
      const hasUniqueUserIndex = indexes.some(
        (idx) => idx.key?.user === 1 && idx.unique === true,
      );
      if (hasUniqueUserIndex) {
        await collection.dropIndex("user_1");
        console.log(
          "Dropped old unique user_1 index on onboardings collection",
        );
      }
    } catch (indexErr) {
      // Index might not exist, that's fine
      if (indexErr.codeName !== "IndexNotFound") {
        console.log("Index cleanup note:", indexErr.message);
      }
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
