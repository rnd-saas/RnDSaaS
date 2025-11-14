import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage.tsx";
import RegisterPage from "../pages/Login/RegisterPage.tsx";
import DefaultPage from "@/pages/DefaultPage.tsx";
import OnboardingManager from "@/pages/Onboarding/OnboardingManager.tsx";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/Settings/SettingsPage.tsx";
import LandingPage from "@/pages/LandingPage";
import ChatbotPage from "@/pages/Chatbot/ChatbotPage.tsx";
import AppLayout from "@/routes/AppLayout";
import RestTimer from "@/pages/Workout/RestTimer";
import WorkoutTimer from "@/pages/Workout/WorkoutTimer";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/onboarding" element={<OnboardingManager/>}/>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/workout/rest" element={<RestTimer />} />
                <Route path="/workout/exercise" element={<WorkoutTimer />} />
                {/* App layout with persistent bottom nav */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    {/* Uncomment when ready */}
                    {/* <Route path="/workout" element={<WorkoutPage />} /> */}
                    {/* <Route path="/social" element={<SocialPage />} /> */}
                    {/* <Route path="/profile" element={<ProfilePage />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
