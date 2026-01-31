import { Route, Routes } from "react-router-dom"
import HomePage from "./Pages/home/Homepage"
import Login from "./Pages/auth/Login"
import Signup from "./Pages/auth/Signup"
import WelcomeSetup from "./Pages/dashboard/welcomesetup"
import GoalPersonalization from "./Pages/dashboard/GoalPersonalization"
import NotFound from "./Pages/NotFound"
import RoadmapPreview from "./Pages/dashboard/RoadmapPreview"

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

      </Routes>
    </>
  )
}

export default App
