import express from "express";
import {
  saveGoal,
  generateQuickRoadmap,
  submitAssessment,
  generateFinalResult,
} from "../controllers/onboarding.controller.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/goal", saveGoal);
router.post("/roadmap", generateQuickRoadmap);
router.post("/assessment", submitAssessment);
router.post("/result", generateFinalResult);

export default router;