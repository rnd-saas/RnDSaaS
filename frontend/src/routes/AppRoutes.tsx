import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "../pages/Login/LoginPage.tsx";
import RegisterPage from "../pages/Login/RegisterPage.tsx";
import DefaultPage from "@/pages/DefaultPage.tsx";
import OnboardingManager from "@/pages/Onboarding/OnboardingManager.tsx";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/Settings/SettingsPage.tsx";
import LandingPage from "@/pages/LandingPage";
import { trackPageView } from "@/lib/analytics";

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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/onboarding" element={<OnboardingManager/>}/>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/landing" element={<LandingPage />} />
            </Routes>
        </BrowserRouter>
    );
}
