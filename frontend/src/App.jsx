import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserProvider from "./contexts/UserContext";
import SpinnerLoader from "./components/loader/SpinnerLoader";

// Lazy load routes for code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Dashboard = lazy(() => import("./pages/Home/Dashboard"));
const InterviewPrep = lazy(() => import("./pages/interviewPrep/InterviewPrep"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <SpinnerLoader />
  </div>
);

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/interview-prep/:sessionId"
                element={<InterviewPrep />}
              />
            </Routes>
          </Suspense>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
};

export default App;
