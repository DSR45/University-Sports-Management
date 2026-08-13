import { Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
export default function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/home') return 'Home';
    if (path.includes('/admin')) {
      if (path === '/admin') return 'Dashboard';
      if (path.includes('players')) return 'Player Management';
      if (path.includes('announcements')) return 'Announcements';
    } else {
      if (path === '/player') return 'Dashboard';
      if (path.includes('profile')) return 'My Profile';
      if (path.includes('evaluation')) return 'My Evaluation';
      if (path.includes('trial-status')) return 'Trial Status';
      if (path.includes('announcements')) return 'Announcements';
    }
    return 'Dashboard';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <span className="eyebrow">
            {user?.role === 'ADMIN' ? 'ADMIN PANEL' : 'PLAYER PORTAL'}
          </span>
          <h2>{getPageTitle()}</h2>
        </div>

        <button
          type="button"
          className="header-home-button"
          onClick={() => navigate('/home')}
        >
          <Home size={15} />
          <span>Home</span>
        </button>
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