import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    goal: {
      type: String,
    },
    experienceLevel: {
      type: String,
    },
    timeline: {
      type: String,
    },
    quickRoadmap: {
      json: Object,
      formatted: String,
    },
    assessmentAnswers: {
      type: Object,
    },
    resultAnalysis: {
      json: Object,
      formatted: String,
    },
    finalRoadmap: {
      json: Object,
      formatted: String,
    },
    confidenceScore: {
      type: Number,
      default: 0,
    },
    confidenceHistory: [
      {
        score: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    completedAt: {
      type: Date,
      default: null,
    },
    completedItems: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const Onboarding = mongoose.model("Onboarding", onboardingSchema);

export default Onboarding;
