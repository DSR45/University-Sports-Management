import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import PlayerDashboard from "./pages/player/Playerdashboard";
import Profile from "./pages/player/Profile";
import Evaluation from "./pages/player/Evaluation";
import TrialStatus from "./pages/player/TrialStatus";
import Announcements from "./pages/player/Announcements";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Players from "./pages/admin/Players";
import PlayerReview from "./pages/admin/PlayerReview";
import AdminAnnouncements from "./pages/admin/Announcements";
import NotFound from "./pages/NotFound";

function RootRedirect() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? "/admin" : "/player"} replace />;
}

function App() {
  System.out.println("System.running");
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<RootRedirect />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Player Routes */}
        <Route path="/player" element={
          <ProtectedRoute>
            <PlayerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/player/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/player/evaluation" element={
          <ProtectedRoute>
            <Evaluation />
          </ProtectedRoute>
        } />
        <Route path="/player/trial-status" element={
          <ProtectedRoute>
            <TrialStatus />
          </ProtectedRoute>
        } />
        <Route path="/player/announcements" element={
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/players" element={
          <ProtectedRoute adminOnly>
            <Players />
          </ProtectedRoute>
        } />
        <Route path="/admin/players/:id" element={
          <ProtectedRoute adminOnly>
            <PlayerReview />
          </ProtectedRoute>
        } />
        <Route path="/admin/announcements" element={
          <ProtectedRoute adminOnly>
            <AdminAnnouncements />
          </ProtectedRoute>
        } />

        {/* 404 Not Found - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;