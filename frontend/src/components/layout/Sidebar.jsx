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
    FileText,
    Newspaper,
    Calendar,
    Trophy,
    Award,
    Image,
    Video,
    Info,
    LogOut
} from 'lucide-react';

export default function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

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
    { path: '/admin/pages', label: 'Public Pages', icon: FileText },
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

  const navItems = isAdmin ? adminNavItems : playerNavItems;
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button type="button" className="sidebar-close-button" onClick={onClose} aria-label="Close menu">
        <span />
      </button>

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
        <div className="nav-label">MENU</div>
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
      </nav>

      {isAdmin && (
        <div className="sidebar-bottom">
          <button
            onClick={logout}
            className="nav-item"
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}