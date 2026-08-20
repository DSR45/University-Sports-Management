import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  CalendarDays,
  Images,
  Info,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Newspaper,
  Phone,
  PlaySquare,
  Sparkles,
  Trophy,
  Users,
  X,
  Home,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../layout/Sidebar';

export default function PublicNavbar({ onMenuClick }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

    useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Matches', path: '/matches', icon: CalendarDays },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Gallery', path: '/gallery', icon: Images },
    { name: 'About', path: '/about', icon: Info },
  ];

  const moreLinks = [
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'Events', path: '/events', icon: Sparkles },
    { name: 'Videos', path: '/videos', icon: PlaySquare },
    { name: 'Contact', path: '/contact', icon: Phone },
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

  const dashboardPath = isAdmin ? '/admin' : '/player';

  return (
    <nav className="public-nav">
      <div className="nav-container">
                <div style={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated && onMenuClick && (
            <button
              type="button"
              className="sidebar-toggle-button"
              onClick={onMenuClick}
              aria-label="Open sidebar menu"
              style={{ display: 'inline-flex', marginRight: '14px', border: 'none', background: 'transparent', padding: '4px' }}
            >
              <SlidersHorizontal size={20} />
            </button>
          )}

          <Link to="/" className="nav-logo" aria-label="Go to home page">
            MUJ VOLLEYBALL
          </Link>
        </div>

        <div className="nav-desktop">
          {navLinks.map(({ path, name, icon: Icon }) => (
            <Link key={path} to={path} className="nav-link">
              <span className="nav-icon"><Icon size={15} /></span>
              <span>{name}</span>
            </Link>
          ))}

          <div className="nav-dropdown">
            <button type="button" className="nav-link nav-more-trigger" aria-label="More navigation options">
              <span className="nav-icon"><MoreHorizontal size={15} /></span>
              <span>More</span>
            </button>
            <div className="dropdown-content">
              {moreLinks.map(({ path, name, icon: Icon }) => (
                <Link key={path} to={path}>
                  <span className="nav-icon"><Icon size={14} /></span>
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          </div>

                    <div className="nav-actions">
            {isAuthenticated ? (
              <div className="user-menu-wrapper" ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="user-chip-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 14px 6px 8px',
                    background: 'linear-gradient(135deg, rgba(255, 106, 0, 0.12), rgba(124, 58, 237, 0.08))',
                    border: '1px solid rgba(255, 106, 0, 0.3)',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff6a00, #ff8c00)',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '12px',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: '0 2px 6px rgba(255, 106, 0, 0.3)'
                    }}
                  >
                    {getInitials(user?.name)}
                  </div>
                  <div style={{ textTransform: 'none', textAlign: 'left', lineHeight: '1.2' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {user?.name || 'Logged In Member'}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--primary-orange)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {user?.role || 'PLAYER'}
                    </span>
                  </div>
                  <ChevronDown size={14} style={{ color: '#8792a2', marginLeft: '4px' }} />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="user-dropdown-menu"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '210px',
                      background: '#ffffff',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '14px',
                      boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
                      padding: '8px',
                      zIndex: 200
                    }}
                  >
                    <button
                      onClick={() => { navigate(dashboardPath); setIsUserMenuOpen(false); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#1a1f36'
                      }}
                    >
                      <LayoutDashboard size={16} />
                      <span>My Dashboard</span>
                    </button>

                    {!isAdmin && (
                      <button
                        onClick={() => { navigate('/player/profile'); setIsUserMenuOpen(false); }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          border: 'none',
                          background: 'transparent',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#1a1f36'
                        }}
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </button>
                    )}

                    <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.2)', margin: '6px 0' }} />

                    <button
                      onClick={logout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#ef4444'
                      }}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button type="button" onClick={() => navigate('/login')} className="nav-action-btn btn-secondary">LOGIN</button>
                <button type="button" onClick={() => navigate('/register')} className="nav-action-btn btn-primary">JOIN THE TEAM</button>
              </>
            )}
          </div>
        </div>

                <button type="button" className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
                  {isOpen ? <X size={18} /> : <MoreVertical size={20} />}
                </button>
      </div>

      {isOpen && (
        <div className="nav-mobile">
          {[...navLinks, ...moreLinks].map(({ path, name, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setIsOpen(false)}>
              <span className="nav-icon"><Icon size={15} /></span>
              <span>{name}</span>
            </Link>
          ))}
                    {isAuthenticated ? (
            <>
              <button type="button" onClick={() => { navigate(dashboardPath); setIsOpen(false); }} className="nav-action-btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LayoutDashboard size={16} />
                <span>MY DASHBOARD ({user?.name})</span>
              </button>
              <button type="button" onClick={logout} className="nav-action-btn btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => { navigate('/login'); setIsOpen(false); }} className="nav-action-btn btn-secondary">LOGIN</button>
              <button type="button" onClick={() => { navigate('/register'); setIsOpen(false); }} className="nav-action-btn btn-primary">JOIN THE TEAM</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}