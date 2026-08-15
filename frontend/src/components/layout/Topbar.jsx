import { Volleyball } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const headerNavItems = [
    { to: '/home', label: 'Home' }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-toggle-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Volleyball size={18} />
        </button>
        <nav className="topbar-nav" aria-label="Header navigation">
          {headerNavItems.map((item) => (
            <Link key={item.to} to={item.to} className="topbar-nav-item">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="top-actions">
        <div
          className="user-chip"
          onClick={() => user?.role !== 'ADMIN' && navigate('/player/profile')}
          style={{ cursor: user?.role !== 'ADMIN' ? 'pointer' : 'default' }}
        >
          <div className="avatar">{getInitials(user?.name)}</div>
          <div className="user-text">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}