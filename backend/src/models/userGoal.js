import mongoose from "mongoose";

const userGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  goalText: {
    type: String,
    required: true
  },
  experienceLevel: String,
  preferredStyle: String,
  dailyTimeMinutes: Number,
  preferredLanguage: String,
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  },
  onboardingStatus: {
    type: String,
    default: "goal_set"
  }
}, { timestamps: true });

export default mongoose.model("UserGoal", userGoalSchema);