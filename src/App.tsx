// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./context/useAuth";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();   // ← use `user`, not `currentUser`
  if (loading) return <div className="center">Loading…</div>;
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
