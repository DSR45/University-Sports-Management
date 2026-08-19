import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/public/PublicLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import HomePage from "./pages/Home";
import PlayerDashboard from "./pages/player/Playerdashboard";
import Profile from "./pages/player/Profile";
import Evaluation from "./pages/player/Evaluation";
import TrialStatus from "./pages/player/TrialStatus";
import Announcements from "./pages/player/Announcements";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Players from "./pages/admin/Players";
import PlayerReview from "./pages/admin/PlayerReview";
import AdminAnnouncements from "./pages/admin/Announcements";
import AdminPages from "./pages/admin/AdminPages";
import AdminNews from "./pages/admin/AdminNews";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/public/LandingPage";
import TeamPage from "./pages/public/TeamPage";
import MatchesPage from "./pages/public/MatchesPage";
import NewsPage from "./pages/public/NewsPage";
import GalleryPage from "./pages/public/GalleryPage";
import AboutPage from "./pages/public/AboutPage";
import AchievementsPage from "./pages/public/AchievementsPage";
import EventsPage from "./pages/public/EventsPage";
import VideosPage from "./pages/public/VideosPage";
import JoinPage from "./pages/public/JoinPage";
import ContactPage from "./pages/public/ContactPage";

function PublicPage({ children }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicPage><LandingPage /></PublicPage>} />
        <Route path="/team" element={<PublicPage><TeamPage /></PublicPage>} />
        <Route path="/matches" element={<PublicPage><MatchesPage /></PublicPage>} />
        <Route path="/news" element={<PublicPage><NewsPage /></PublicPage>} />
        <Route path="/gallery" element={<PublicPage><GalleryPage /></PublicPage>} />
        <Route path="/about" element={<PublicPage><AboutPage /></PublicPage>} />
        <Route path="/achievements" element={<PublicPage><AchievementsPage /></PublicPage>} />
        <Route path="/events" element={<PublicPage><EventsPage /></PublicPage>} />
        <Route path="/videos" element={<PublicPage><VideosPage /></PublicPage>} />
        <Route path="/join" element={<PublicPage><JoinPage /></PublicPage>} />
        <Route path="/contact" element={<PublicPage><ContactPage /></PublicPage>} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private team home */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

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
        <Route path="/admin/pages" element={
          <ProtectedRoute adminOnly>
            <AdminPages />
          </ProtectedRoute>
        } />
        <Route path="/admin/news" element={
          <ProtectedRoute adminOnly>
            <AdminNews />
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

