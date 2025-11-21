import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "../pages/Login/LoginPage.tsx";
import RegisterPage from "../pages/Login/RegisterPage.tsx";
import DefaultPage from "@/pages/DefaultPage.tsx";
import OnboardingManager from "@/pages/Onboarding/OnboardingManager.tsx";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/Settings/SettingsPage.tsx";
import LandingPage from "@/pages/LandingPage";
import ChatbotPage from "@/pages/Chatbot/ChatbotPage";
import { trackPageView } from "@/lib/analytics";

// Component to track page views on route changes
function PageViewTracker() {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location]);

    return null;
}
import AppLayout from "@/routes/AppLayout";
import RestTimer from "@/pages/Workout/RestTimer";
import WorkoutTimer from "@/pages/Workout/WorkoutTimer";
import ProfilePage from "@/pages/Profile/ProfilePage.tsx";
import SocialPage from "@/pages/Social/SocialPage.tsx";
import MoodPage from "@/pages/Mood/MoodPage";
import CalendarPage from "@/pages/CalendarPage.tsx";
import AchievementPage from "@/pages/AchievementPage.tsx";


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <PageViewTracker />
            <Routes>
                <Route path="/" element={<DefaultPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/onboarding" element={<OnboardingManager/>}/>
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
                    {/* Uncomment when ready */}
                    {/* <Route path="/workout" element={<WorkoutPage />} /> */}
                    <Route path="/social" element={<SocialPage />} />
                     <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
