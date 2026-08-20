import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './layout/Sidebar';
import PublicNavbar from './public/PublicNavbar';
import PublicFooter from './public/PublicFooter';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/player" replace />;
  }

  return (
    <div className="public-layout">
      {createPortal(
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
        </>,
        document.body
      )}
      <PublicNavbar onMenuClick={() => setIsSidebarOpen((open) => !open)} />
      <main className="public-main">
        <div className="container" style={{ padding: '30px 20px' }}>
          {children}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}