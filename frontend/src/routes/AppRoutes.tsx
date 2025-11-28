import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultPage from "@/pages/DefaultPage.tsx";
import OnboardingManager from "@/pages/Onboarding/OnboardingManager.tsx";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/Settings/SettingsPage.tsx";
import LandingPage from "@/pages/LandingPage";
import ChatbotPage from "@/pages/Chatbot/ChatbotPage.tsx";
import AppLayout from "@/routes/AppLayout";
import RestTimer from "@/pages/Workout/RestTimer";
import WorkoutTimer from "@/pages/Workout/WorkoutTimer";
import ProfilePage from "@/pages/Profile/ProfilePage.tsx";
import ProgressPage from "@/pages/Progress/ProgressPage.tsx";
import SocialPage from "@/pages/Social/SocialPage.tsx";
import MoodPage from "@/pages/Mood/MoodPage";
import CalendarPage from "@/pages/Profile/CalendarPage.tsx";
import AchievementPage from "@/pages/Profile/AchievementPage.tsx";
import OnboardingInvitePage from "@/pages/Onboarding/OnboardingInvitePage.tsx";

import PlannedWorkoutPage from "@/pages/Workout/PlannedWorkoutPage.tsx";
import ActiveWorkoutPage from "@/pages/Workout/ActiveWorkoutPage.tsx";
import ExercisePage from "@/pages/ExercisePage.tsx";
import WorkoutEvaluationPage from "@/pages/Workout/WorkoutEvaluationPage.tsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/onboarding" element={<OnboardingManager />} />
        <Route path="/onboarding-invite" element={<OnboardingInvitePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/workout/rest" element={<RestTimer />} />
        <Route path="/workout/exercise" element={<WorkoutTimer />} />
        <Route path="/mood" element={<MoodPage />} />

        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/achievements" element={<AchievementPage />} />
        {/* App layout with persistent bottom nav */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/workout" element={<PlannedWorkoutPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Route>
        <Route path="/workout/:id" element={<ActiveWorkoutPage />} />
        <Route
          path="/workout/:id/evaluation"
          element={<WorkoutEvaluationPage />}
        />
        <Route path="/exercise/:exerciseSlug" element={<ExercisePage />} />
      </Routes>
    </BrowserRouter>
  );
}
