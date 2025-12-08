import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import DefaultPage from "@/pages/DefaultPage";
import OnboardingManager from "@/pages/Onboarding/OnboardingManager";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import LandingPage from "@/pages/LandingPage";
import ChatbotPage from "@/pages/Chatbot/ChatbotPage";
import { trackPageView } from "@/lib/analytics";
import AppLayout from "@/routes/AppLayout";
import RestTimer from "@/pages/Workout/RestTimer";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ProgressPage from "@/pages/Progress/ProgressPage";
import SocialPage from "@/pages/Social/SocialPage";
import SocialCreatePostPage from "@/pages/Social/SocialCreatePostPage";
import SocialManageFriendsPage from "@/pages/Social/SocialManageFriendsPage";
import MoodPage from "@/pages/Mood/MoodPage";
import CalendarPage from "@/pages/Profile/CalendarPage";
import AchievementPage from "@/pages/Profile/AchievementPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import PaymentSuccessPage from "@/pages/Payment/SuccessPage";
import PaymentCancelPage from "@/pages/Payment/CancelPage";
import OnboardingInvitePage from "@/pages/Onboarding/OnboardingInvitePage";

import PlannedWorkoutPage from "@/pages/Workout/PlannedWorkoutPage";
import ActiveWorkoutPage from "@/pages/Workout/ActiveWorkoutPage";
import ExercisePage from "@/pages/ExercisePage";
import WorkoutEvaluationPage from "@/pages/Workout/WorkoutEvaluationPage";
import WorkoutPlanChatbotPage from "@/pages/Workout/WorkoutPlanChatbotPage";

// Component to track page views on route changes
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/onboarding" element={<OnboardingManager />} />
        <Route path="/onboarding-invite" element={<OnboardingInvitePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/workout/plan-chatbot" element={<WorkoutPlanChatbotPage />} />
        <Route
          path="/workout/:workoutId/:exerciseSlug/rest"
          element={<RestTimer />}
        />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/achievements" element={<AchievementPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />
        {/* App layout with persistent bottom nav */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/workout" element={<PlannedWorkoutPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/social/post" element={<SocialCreatePostPage />} />
          <Route path="/social/manage" element={<SocialManageFriendsPage />} />
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
