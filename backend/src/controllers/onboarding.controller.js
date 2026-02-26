import Onboarding from "../models/onboarding.js";
import User from "../models/user.js";
import {
  generateQuickRoadmap as generateQuickRoadmapAI,
  generateAssessmentResult,
  generateFinalRoadmap,
  generateAssessmentQuestions as generateQuestionsAI,
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

    // Calculate actual confidence score from answers
    const answers = onboarding.assessmentAnswers;
    let correctCount = 0;
    let totalCount = 0;

    if (Array.isArray(answers)) {
      totalCount = answers.length;
      answers.forEach((a) => {
        if (a.selectedOption === a.correctAnswer) {
          correctCount++;
        }
      });
    }

    const calculatedScore =
      totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

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
    onboarding.confidenceScore = calculatedScore;
    onboarding.isCompleted = true;

    // Push to confidence history for graph tracking
    onboarding.confidenceHistory.push({
      score: calculatedScore,
      date: new Date(),
    });

    await onboarding.save();

    // Mark user as onboarded so they skip onboarding on next login
    await User.findByIdAndUpdate(req.user._id, { isOnboarded: true });

    res.status(200).json({
      success: true,
      message: "Final roadmap generated successfully",
      data: {
        resultAnalysis,
        finalRoadmap,
        confidenceScore: calculatedScore,
        correctCount,
        totalCount,
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

/* GET /api/onboarding/questions */
export const generateQuestions = async (req, res) => {
  try {
    const onboarding = await Onboarding.findOne({ user: req.user._id });

    if (!onboarding || !onboarding.goal) {
      return res.status(400).json({
        success: false,
        message: "Please complete goal setup first.",
      });
    }

    const result = await generateQuestionsAI({
      goal: onboarding.goal,
      experienceLevel: onboarding.experienceLevel || "Beginner",
    });

    res.status(200).json({
      success: true,
      data: result.json,
    });
  } catch (error) {
    console.error("Question Generation Error:", error);
    if (error.message.includes("quota") || error.message.includes("429")) {
      return res.status(429).json({
        success: false,
        message: "AI service is at capacity. Please try again in 30 seconds.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

/* GET /api/onboarding/data */
export const getUserOnboardingData = async (req, res) => {
  try {
    const onboarding = await Onboarding.findOne({ user: req.user._id });

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message: "No onboarding data found.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        goal: onboarding.goal,
        experienceLevel: onboarding.experienceLevel,
        timeline: onboarding.timeline,
        resultAnalysis: onboarding.resultAnalysis,
        finalRoadmap: onboarding.finalRoadmap,
        confidenceScore: onboarding.confidenceScore,
        confidenceHistory: onboarding.confidenceHistory,
        isCompleted: onboarding.isCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch onboarding data",
      error: error.message,
    });
  }
};
