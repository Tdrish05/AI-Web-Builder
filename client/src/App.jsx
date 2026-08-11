import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { GuestLayout, AuthLayout, SidebarLayout } from "./pages/Layout";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/HomePage";
import BuilderPage from "./pages/BuilderPage";
import PreviewPage from "./pages/PreviewPage";
import PublishPage from "./pages/PublishPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProjectsPage from "./pages/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AppContextProvider>
      <Toaster />
      <Routes>
        {/* Guest Routes */}
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Routes with Collapsible Sidebar */}
        <Route element={<AuthLayout />}>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          {/* Protected Routes without Sidebar (Full View IDE) */}
          <Route path="/builder/:id" element={<BuilderPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
        </Route>

        {/* Public Routes */}
        <Route path="/publish/:id" element={<PublishPage />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContextProvider>
  );
};

// Wrap App with provider inside main.jsx, or keep provider here.
// Wait, in main.jsx, is App wrapped, or does App wrap itself?
// Let's check App.jsx:
// Line 12: import { AppContextProvider } from "./context/AppContext";
// Line 17: <AppContextProvider>
// So App.jsx wraps itself!
// Let's import AppContextProvider in App.jsx.
import { AppContextProvider } from "./context/AppContext";

export default App;