import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
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
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Onboarding = mongoose.model("Onboarding", onboardingSchema);

export default Onboarding;