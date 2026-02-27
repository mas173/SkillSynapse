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

    // Always create a new goal (multi-goal support)
    const onboarding = await Onboarding.create({
      user: req.user._id,
      goal,
      experienceLevel,
      timeline,
    });

    res.status(200).json({
      success: true,
      message: "Goal saved successfully",
      data: onboarding,
      goalId: onboarding._id,
    });
  } catch (error) {
    console.log(error);
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
    const goalId = req.body.goalId || req.query.goalId;
    const query = goalId
      ? { _id: goalId, user: req.user._id }
      : { user: req.user._id };
    const onboarding = await Onboarding.findOne(query).sort({ createdAt: -1 });

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

    res
      .status(200)
      .json({ success: true, data: aiRoadmap, goalId: onboarding._id });
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
    const { answers, goalId } = req.body;

    if (!answers) {
      return res.status(400).json({
        success: false,
        message: "Assessment answers are required",
      });
    }

    const query = goalId
      ? { _id: goalId, user: req.user._id }
      : { user: req.user._id };
    const onboarding = await Onboarding.findOne(query).sort({ createdAt: -1 });

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
      goalId: onboarding._id,
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
    const goalId = req.body.goalId || req.query.goalId;
    const query = goalId
      ? { _id: goalId, user: req.user._id }
      : { user: req.user._id };
    const onboarding = await Onboarding.findOne(query).sort({ createdAt: -1 });

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
      goalId: onboarding._id,
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
    const goalId = req.query.goalId;
    const query = goalId
      ? { _id: goalId, user: req.user._id }
      : { user: req.user._id };
    const onboarding = await Onboarding.findOne(query).sort({ createdAt: -1 });

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
      goalId: onboarding._id,
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

/* GET /api/onboarding/data — single goal data */
export const getUserOnboardingData = async (req, res) => {
  try {
    const goalId = req.query.goalId;
    const query = goalId
      ? { _id: goalId, user: req.user._id }
      : { user: req.user._id };
    const onboarding = await Onboarding.findOne(query).sort({ createdAt: -1 });

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message: "No onboarding data found.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: onboarding._id,
        goal: onboarding.goal,
        experienceLevel: onboarding.experienceLevel,
        timeline: onboarding.timeline,
        resultAnalysis: onboarding.resultAnalysis,
        finalRoadmap: onboarding.finalRoadmap,
        confidenceScore: onboarding.confidenceScore,
        confidenceHistory: onboarding.confidenceHistory,
        isCompleted: onboarding.isCompleted,
        status: onboarding.status,
        completedAt: onboarding.completedAt,
        completedItems: onboarding.completedItems || [],
        createdAt: onboarding.createdAt,
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

/* GET /api/onboarding/goals — all goals for user */
export const getAllGoals = async (req, res) => {
  try {
    const goals = await Onboarding.find({ user: req.user._id })
      .select(
        "_id goal experienceLevel status confidenceScore isCompleted completedAt createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
      error: error.message,
    });
  }
};

/* GET /api/onboarding/stats — aggregated dashboard stats */
export const getDashboardStats = async (req, res) => {
  try {
    const goals = await Onboarding.find({ user: req.user._id }).lean();

    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.status === "completed").length;
    const activeGoals = goals.filter((g) => g.status === "active").length;

    // Collect all confidence history entries and total assessments
    let allHistory = [];
    let totalAssessments = 0;
    let totalScore = 0;
    let scoredAssessments = 0;

    goals.forEach((g) => {
      if (g.confidenceHistory && g.confidenceHistory.length > 0) {
        totalAssessments += g.confidenceHistory.length;
        g.confidenceHistory.forEach((entry) => {
          allHistory.push({
            score: entry.score,
            date: entry.date,
            goal: g.goal,
          });
          totalScore += entry.score;
          scoredAssessments++;
        });
      }
    });

    // Sort combined history by date
    allHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

    const averageScore =
      scoredAssessments > 0 ? Math.round(totalScore / scoredAssessments) : 0;

    // Calculate active streak (consecutive days with at least one assessment)
    let activeStreak = 0;
    if (allHistory.length > 0) {
      const uniqueDays = [
        ...new Set(
          allHistory.map((h) => new Date(h.date).toISOString().split("T")[0]),
        ),
      ].sort((a, b) => new Date(b) - new Date(a)); // most recent first

      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      // Streak must start from today or yesterday
      if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
        activeStreak = 1;
        for (let i = 1; i < uniqueDays.length; i++) {
          const prevDay = new Date(uniqueDays[i - 1]);
          const currDay = new Date(uniqueDays[i]);
          const diffMs = prevDay - currDay;
          const diffDays = Math.round(diffMs / 86400000);
          if (diffDays === 1) {
            activeStreak++;
          } else {
            break;
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalGoals,
        completedGoals,
        activeGoals,
        totalAssessments,
        averageScore,
        activeStreak,
        combinedHistory: allHistory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

/* PATCH /api/onboarding/goal/:goalId/complete — toggle goal completion */
export const toggleGoalComplete = async (req, res) => {
  try {
    const { goalId } = req.params;
    const onboarding = await Onboarding.findOne({
      _id: goalId,
      user: req.user._id,
    });

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    if (onboarding.status === "completed") {
      // Re-activate
      onboarding.status = "active";
      onboarding.completedAt = null;
    } else {
      // Mark completed
      onboarding.status = "completed";
      onboarding.completedAt = new Date();
    }

    await onboarding.save();

    res.status(200).json({
      success: true,
      message: `Goal ${onboarding.status === "completed" ? "completed" : "reactivated"} successfully`,
      data: {
        _id: onboarding._id,
        status: onboarding.status,
        completedAt: onboarding.completedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update goal status",
      error: error.message,
    });
  }
};

/* PATCH /api/onboarding/goal/:goalId/roadmap-item — toggle a roadmap item */
export const toggleRoadmapItem = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { itemKey } = req.body;

    if (!itemKey) {
      return res.status(400).json({
        success: false,
        message: "itemKey is required",
      });
    }

    const onboarding = await Onboarding.findOne({
      _id: goalId,
      user: req.user._id,
    });

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const items = onboarding.completedItems || [];
    const idx = items.indexOf(itemKey);

    if (idx === -1) {
      items.push(itemKey);
    } else {
      items.splice(idx, 1);
    }

    onboarding.completedItems = items;
    await onboarding.save();

    res.status(200).json({
      success: true,
      data: { completedItems: onboarding.completedItems },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle roadmap item",
      error: error.message,
    });
  }
};
