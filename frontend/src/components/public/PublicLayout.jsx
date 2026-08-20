import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import Sidebar from '../layout/Sidebar';

export default function PublicLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="public-layout">
      {isAuthenticated && createPortal(
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
        </>,
        document.body
      )}
      <PublicNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="public-main">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}