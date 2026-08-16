import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Images,
  Info,
  Menu,
  MoreHorizontal,
  Newspaper,
  Phone,
  PlaySquare,
  Sparkles,
  Trophy,
  Users,
  X,
  Home
} from 'lucide-react';
import { useState } from 'react';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <nav className="public-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo" aria-label="Go to home page">
          MUJ VOLLEYBALL
        </Link>

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
            <button type="button" onClick={() => navigate('/login')} className="nav-action-btn btn-secondary">LOGIN</button>
            <button type="button" onClick={() => navigate('/register')} className="nav-action-btn btn-primary">JOIN THE TEAM</button>
          </div>
        </div>

        <button type="button" className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
          {isOpen ? <X size={18} /> : <Menu size={18} />}
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
          <button type="button" onClick={() => { navigate('/login'); setIsOpen(false); }} className="nav-action-btn btn-secondary">LOGIN</button>
          <button type="button" onClick={() => { navigate('/register'); setIsOpen(false); }} className="nav-action-btn btn-primary">JOIN THE TEAM</button>
        </div>
      )}
    </nav>
  );
}