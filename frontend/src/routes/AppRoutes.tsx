import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage.tsx";
import RegisterPage from "../pages/Login/RegisterPage.tsx";
import DefaultPage from "@/pages/DefaultPage.tsx";
import OnboardingManager from "@/pages/Onboarding/OnboardingManager.tsx";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/Settings/SettingsPage.tsx";
import LandingPage from "@/pages/LandingPage";
import PlannedWorkoutPage from "@/pages/Workout/PlannedWorkoutPage.tsx";
import ActiveWorkoutPage from "@/pages/Workout/ActiveWorkoutPage.tsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingManager />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/workout" element={<PlannedWorkoutPage />} />
        <Route
          path="/active-workout/:plannedWorkoutId"
          element={<ActiveWorkoutPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
