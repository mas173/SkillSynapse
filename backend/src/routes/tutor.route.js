import express from "express";
import {
    chat,
    getHistory,
    getSessions,
    deleteSession,
    renameSession,
} from "../controllers/tutor.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/chat", chat);
router.get("/sessions", getSessions);
router.get("/history/:sessionId", getHistory);
router.delete("/sessions/:sessionId", deleteSession);
router.patch("/sessions/:sessionId", renameSession);

export default router;
