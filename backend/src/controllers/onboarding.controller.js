import Onboarding from "../models/onboarding.js";
import User from "../models/user.js";
import {
  generateQuickRoadmap as generateQuickRoadmapAI,
  generateAssessmentResult,
  generateFinalRoadmap,
} from "../services/geminiService.js";

/* POST /api/onboarding/goal */
export const saveGoal = async (req, res) => {
  try {
    const { goal, experienceLevel, timeline } = req.body;

    if (!goal) {
      return res.status(400).json({
        success: false,
        message: "Goal is required",
      });
    }

    let onboarding = await Onboarding.findOne({ user: req.user._id });

    if (!onboarding) {
      onboarding = await Onboarding.create({
        user: req.user._id,
        goal,
        experienceLevel,
        timeline,
      });
    } else {
      onboarding.goal = goal;
      onboarding.experienceLevel = experienceLevel;
      onboarding.timeline = timeline;
      await onboarding.save();
    }

    res.status(200).json({
      success: true,
      message: "Goal saved successfully",
      data: onboarding,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save goal",
      error: error.message,
    });
  }
};

/* POST /api/onboarding/roadmap */
export const generateQuickRoadmap = async (req, res) => {
  try {
    const onboarding = await Onboarding.findOne({ user: req.user._id });

    if (!onboarding || !onboarding.goal) {
      return res
        .status(400)
        .json({ success: false, message: "Goal not found." });
    }

    const aiRoadmap = await generateQuickRoadmapAI({
      goal: onboarding.goal,
      experienceLevel: onboarding.experienceLevel,
      timeline: onboarding.timeline,
    });

    onboarding.quickRoadmap = aiRoadmap;
    await onboarding.save();

    res.status(200).json({ success: true, data: aiRoadmap });
  } catch (error) {
    if (error.message.includes("quota") || error.message.includes("429")) {
      return res.status(429).json({
        success: false,
        message:
          "AI service is currently at capacity. Please try again in 30 seconds.",
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

/* POST /api/onboarding/assessment */
export const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({
        success: false,
        message: "Assessment answers are required",
      });
    }

    const onboarding = await Onboarding.findOne({ user: req.user._id });

    if (!onboarding) {
      return res.status(400).json({
        success: false,
        message: "Onboarding not initialized",
      });
    }

    onboarding.assessmentAnswers = answers;
    await onboarding.save();

    res.status(200).json({
      success: true,
      message: "Assessment submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit assessment",
      error: error.message,
    });
  }
};

/* POST /api/onboarding/result */
export const generateFinalResult = async (req, res) => {
  try {
    const onboarding = await Onboarding.findOne({ user: req.user._id });

    if (!onboarding || !onboarding.assessmentAnswers) {
      return res.status(400).json({
        success: false,
        message: "Assessment not completed",
      });
    }

    // Generate AI Result Summary
    const resultAnalysis = await generateAssessmentResult({
      goal: onboarding.goal,
      answers: onboarding.assessmentAnswers,
    });

    // Generate Final Personalized Roadmap
    const finalRoadmap = await generateFinalRoadmap({
      goal: onboarding.goal,
      experienceLevel: onboarding.experienceLevel,
      timeline: onboarding.timeline,
      answers: onboarding.assessmentAnswers,
      analysis: resultAnalysis,
    });

    onboarding.resultAnalysis = resultAnalysis;
    onboarding.finalRoadmap = finalRoadmap;
    onboarding.isCompleted = true;

    await onboarding.save();

    // Mark user as onboarded so they skip onboarding on next login
    await User.findByIdAndUpdate(req.user._id, { isOnboarded: true });

    res.status(200).json({
      success: true,
      message: "Final roadmap generated successfully",
      data: {
        resultAnalysis,
        finalRoadmap,
      },
    });
  } catch (error) {
    console.error("Final Result Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate final result",
      error: error.message,
    });
  }
};
