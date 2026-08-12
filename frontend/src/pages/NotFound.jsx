import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleGoHome = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/player');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f9fc',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '120px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #FF6B35, #004E89)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1',
          marginBottom: '20px'
        }}>
          404
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1f36',
          marginBottom: '12px'
        }}>
          Page Not Found
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#697386',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          Sorry, we couldn't find the page you're looking for.
          It might have been moved or deleted.
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleGoBack}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#4d5868',
              border: '1px solid #e5e8ed',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f7f9fc';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          <button
            onClick={handleGoHome}
            style={{
              padding: '12px 24px',
              background: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(255, 107, 53, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#FF8C61';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#FF6B35';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.2)';
            }}
          >
            <Home size={16} />
            Go to Home
          </button>
        </div>

        <div style={{
          marginTop: '48px',
          padding: '16px',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e8ed'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#8792a2',
            margin: 0
          }}>
            If you believe this is an error, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}