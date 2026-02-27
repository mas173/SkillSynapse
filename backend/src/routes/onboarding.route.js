import express from "express";
import {
  saveGoal,
  generateQuickRoadmap,
  submitAssessment,
  generateFinalResult,
  generateQuestions,
  getUserOnboardingData,
  getAllGoals,
  getDashboardStats,
  toggleGoalComplete,
  toggleRoadmapItem,
} from "../controllers/onboarding.controller.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Existing routes (now support goalId)
router.post("/goal", saveGoal);
router.post("/roadmap", generateQuickRoadmap);
router.get("/questions", generateQuestions);
router.get("/data", getUserOnboardingData);
router.post("/assessment", submitAssessment);
router.post("/result", generateFinalResult);

// New multi-goal routes
router.get("/goals", getAllGoals);
router.get("/stats", getDashboardStats);
router.patch("/goal/:goalId/complete", toggleGoalComplete);
router.patch("/goal/:goalId/roadmap-item", toggleRoadmapItem);

export default router;
