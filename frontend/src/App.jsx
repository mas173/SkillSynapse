import { Route, Routes } from "react-router-dom"
import HomePage from "./Pages/home/Homepage"
import Login from "./Pages/auth/Login"
import Signup from "./Pages/auth/Signup"
import WelcomeSetup from "./Pages/onboarding/welcomesetup"
import GoalPersonalization from "./Pages/onboarding/GoalPersonalization"
import NotFound from "./Pages/NotFound"
import RoadmapPreview from "./Pages/onboarding/RoadmapPreview"
import SkillAssessment from "./Pages/assessment/SkillAssessment"
import SkillGapReport from "./Pages/assessment/SkillGapReport"
import Dashboard from "./Pages/dashboard/Dashboard"
import TutorChat from "./Pages/tutor/Chat"
import Roadmap from "./Pages/dashboard/Roadmap"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Auth Route */}
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>


        <Route path="/onboarding" element={<WelcomeSetup/>}/> {/* To be removed */}
        <Route path="*" element={<NotFound/>} />

        {/* Onboarding */}
        <Route path="/onboarding/goal" element={<GoalPersonalization/>} />
        <Route path="/onboarding/roadmap" element={<RoadmapPreview/>} />
        <Route path="/onboarding/assessment" element={<SkillAssessment/>} />
        <Route path="/assessment/report" element={<SkillGapReport/>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/roadmap" element={<Roadmap/>} />
        <Route path="/tutor" element={<TutorChat/>} />

      </Routes>
    </>
  )
}

export default App
