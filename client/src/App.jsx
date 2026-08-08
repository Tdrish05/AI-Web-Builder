import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { GuestLayout, AuthLayout } from "./pages/Layout";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/HomePage";
import BuilderPage from "./pages/BuilderPage";
import PreviewPage from "./pages/PreviewPage";
import PublishPage from "./pages/PublishPage";
import { Toaster } from "react-hot-toast";

// 1. Import your Context Provider
import { AppContextProvider } from "./context/AppContext"; 

const App = () => {
  return (
    // 2. Wrap your application with the Provider
    <AppContextProvider>
      <Toaster/>
      <Routes>
        {/* Login Routes */}
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/builder/:id" element={<BuilderPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
        </Route>

        {/* Public Routes */}
        <Route path='/publish/:id' element={<PublishPage/>}/>

        {/* Catch all */}
        <Route path='*' element={<Navigate to="/" replace />}/>
      </Routes>
    </AppContextProvider>
  );
};

export default App;