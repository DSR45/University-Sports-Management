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
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { isAdmin, logout, user } = useAuth();

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
    { path: '/admin/players', label: 'Players', icon: Users },
    { path: '/admin/announcements', label: 'Announcements', icon: Megaphone }
  ];

  const navItems = isAdmin ? adminNavItems : playerNavItems;
  return (
    <aside className="sidebar">
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
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

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
    </aside>
  );
}