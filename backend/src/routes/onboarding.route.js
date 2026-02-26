import express from "express";
import {
  saveGoal,
  generateQuickRoadmap,
  submitAssessment,
  generateFinalResult,
  generateQuestions,
  getUserOnboardingData,
} from "../controllers/onboarding.controller.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/goal", saveGoal);
router.post("/roadmap", generateQuickRoadmap);
router.get("/questions", generateQuestions);
router.get("/data", getUserOnboardingData);
router.post("/assessment", submitAssessment);
router.post("/result", generateFinalResult);

export default router;
