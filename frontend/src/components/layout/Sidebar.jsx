import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Volleyball,
  LayoutDashboard,
  User,
  ClipboardCheck,
  TrendingUp,
  Megaphone,
  Users,
  Newspaper,
  Calendar,
  Trophy,
  Award,
  Image,
  Video,
  Info,
  LogOut,
  Home
} from 'lucide-react';

export default function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation();
  const { isAdmin, isAuthenticated, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const playerNavItems = [
    { path: '/player', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/player/profile', label: 'Profile', icon: User },
    { path: '/player/evaluation', label: 'Evaluation', icon: ClipboardCheck },
    { path: '/player/trial-status', label: 'Trial Status', icon: TrendingUp },
    { path: '/player/announcements', label: 'Announcements', icon: Megaphone }
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/news', label: 'News Articles', icon: Newspaper },
    { path: '/admin/events', label: 'Events & Trials', icon: Calendar },
    { path: '/admin/matches', label: 'Matches & Scores', icon: Trophy },
    { path: '/admin/achievements', label: 'Achievements', icon: Award },
    { path: '/admin/gallery', label: 'Photo Gallery', icon: Image },
    { path: '/admin/videos', label: 'Video Highlights', icon: Video },
    { path: '/admin/team-info', label: 'Team Info', icon: Info },
    { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { path: '/admin/players', label: 'Players Database', icon: Users }
  ];

  const publicNavItems = [
    { path: '/', label: 'Public Home', icon: Home },
    { path: '/team', label: 'Team Roster', icon: Users },
    { path: '/matches', label: 'Match Center', icon: Trophy },
    { path: '/news', label: 'Latest News', icon: Newspaper },
  ];

  const navItems = isAdmin ? adminNavItems : playerNavItems;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">
          <Volleyball size={24} />
        </div>
        <div>
          <strong>MUJ Volleyball</strong>
          <span>MANIPAL UNIVERSITY JAIPUR</span>
        </div>
      </div>

      <nav>
        <div className="nav-label">WORKSTATION</div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={onClose}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="nav-label" style={{ marginTop: '20px' }}>PUBLIC WEBSITE</div>
        {publicNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={onClose}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {isAuthenticated && (
        <div className="sidebar-bottom">
          <button
            onClick={() => { onClose && onClose(); logout(); }}
            className="nav-item"
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', color: '#ef4444' }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}