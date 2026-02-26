import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/home/Homepage";
import Login from "./Pages/auth/Login";
import Signup from "./Pages/auth/Signup";
import GoalPersonalization from "./Pages/onboarding/GoalPersonalization";
import NotFound from "./Pages/NotFound";
import RoadmapPreview from "./Pages/onboarding/RoadmapPreview";
import SkillAssessment from "./Pages/assessment/SkillAssessment";
import SkillGapReport from "./Pages/assessment/SkillGapReport";
import Dashboard from "./Pages/dashboard/Dashboard";
import TutorChat from "./Pages/tutor/Chat";
import Roadmap from "./Pages/dashboard/Roadmap";
import ProtectedRoute from "./Components/common/ProtectedRoute";
import PublicOnlyRoute from "./Components/common/PublicOnlyRoute";
import useAuthStore from "./store/useAuthStore";

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes — redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        {/* Onboarding — protected */}
        <Route
          path="/onboarding/goal"
          element={
            <ProtectedRoute>
              <GoalPersonalization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/roadmap"
          element={
            <ProtectedRoute>
              <RoadmapPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/assessment"
          element={
            <ProtectedRoute>
              <SkillAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/report"
          element={
            <ProtectedRoute>
              <SkillGapReport />
            </ProtectedRoute>
          }
        />

        {/* Dashboard — protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor"
          element={
            <ProtectedRoute>
              <TutorChat />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
