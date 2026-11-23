import { lazy, Suspense, useContext } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import UserProvider from "./contexts/UserProvider";
import { UserContext } from "./contexts/userContext";

const InterviewPrep = lazy(() => import("./pages/interviewPrep/InterviewPrep"));

function Protected({ children }) {
  const { user, loading, profileError } = useContext(UserContext);
  if (loading) return <p className="page-status" role="status">Loading your workspace…</p>;
  if (profileError) {
    return (
      <main className="page-status">
        <p role="alert">We couldn’t load your workspace. Please try again.</p>
        <button className="action-button mt-4" onClick={() => window.location.reload()}>Retry</button>
      </main>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function AuthPage({ children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f7f3] px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-5 inline-block text-lg font-extrabold text-emerald-800">PrepPilot.AI</Link>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">{children}</div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage><Login /></AuthPage>} />
          <Route path="/signup" element={<AuthPage><SignUp /></AuthPage>} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/interview-prep/:sessionId" element={<Protected><Suspense fallback={<p className="page-status" role="status">Loading questions…</p>}><InterviewPrep /></Suspense></Protected>} />
          <Route path="*" element={<main className="page-status"><h1>Page not found</h1><Link className="action-button mt-4" to="/">Back to home</Link></main>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </UserProvider>
  );
}
