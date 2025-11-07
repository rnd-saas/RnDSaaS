import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage.tsx";
import RegisterPage from "../pages/Login/RegisterPage.tsx";
import DefaultPage from "@/pages/DefaultPage.tsx";
import OnboardingManager from "@/pages/Onboarding/OnboardingManager.tsx";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/onboarding" element={<OnboardingManager/>}/>
            </Routes>
        </BrowserRouter>
    );
}