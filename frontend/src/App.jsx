import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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
import LoadingScreen from "./Components/common/Loader";

// Guard: only allow dashboard access if user is onboarded
function OnboardedRoute({ children }) {
  const { isAuthenticated, isOnboarded, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen title="Loading..." subtitle="Please wait" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding/goal" replace />;
  }

  return children;
}

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

        {/* Assessment — protected (accessible from onboarding flow + dashboard re-assessment) */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <SkillAssessment />
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

        {/* Dashboard — protected + must be onboarded */}
        <Route
          path="/dashboard"
          element={
            <OnboardedRoute>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </OnboardedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <OnboardedRoute>
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            </OnboardedRoute>
          }
        />
        <Route
          path="/tutor"
          element={
            <OnboardedRoute>
              <ProtectedRoute>
                <TutorChat />
              </ProtectedRoute>
            </OnboardedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
