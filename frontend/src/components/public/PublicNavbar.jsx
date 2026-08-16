import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Team', path: '/team' },
    { name: 'Matches', path: '/matches' },
    { name: 'News', path: '/news' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
  ];

  const moreLinks = [
    { name: 'Achievements', path: '/achievements' },
    { name: 'Events', path: '/events' },
    { name: 'Videos', path: '/videos' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="public-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          MUJ VOLLEYBALL
        </Link>

        <div className="nav-desktop">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="nav-link">{link.name}</Link>
          ))}
          <div className="nav-dropdown">
            <button className="nav-link">More</button>
            <div className="dropdown-content">
              {moreLinks.map(link => (
                <Link key={link.path} to={link.path}>{link.name}</Link>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/login')} className="btn-secondary">LOGIN</button>
          <button onClick={() => navigate('/register')} className="btn-primary">JOIN THE TEAM</button>
        </div>

        <button className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="nav-mobile">
          {[...navLinks, ...moreLinks].map(link => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>{link.name}</Link>
          ))}
          <button onClick={() => { navigate('/login'); setIsOpen(false); }} className="btn-secondary">LOGIN</button>
          <button onClick={() => { navigate('/register'); setIsOpen(false); }} className="btn-primary">JOIN THE TEAM</button>
        </div>
      )}
    </nav>
  );
}