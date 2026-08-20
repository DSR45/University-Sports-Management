import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Volleyball, Eye, EyeOff } from "lucide-react";
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

    const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setErrorMsg(error?.message || 'Login failed. Please check your credentials or backend server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <Volleyball size={28} />
        </div>





        <span className="eyebrow">MUJ VOLLEYBALL</span>
        <h1>Welcome back</h1>

        <p>
          Sign in to manage your volleyball trial application.
        </p>

        <form onSubmit={handleLogin}>

          <label className="field">
            <span>Email Address</span>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <div style={{ position: 'relative' }}>
              <input
              name="password"
                type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              required
                disabled={loading}
                autoComplete="current-password"
                style={{ paddingRight: '40px' }}
            />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#8792a2',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
        </div>
          </label>

                    {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className={`primary auth-button ${loading ? 'button-loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?



          <Link to="/register">Register here</Link>
        </div>
    </div>





        </div>



  );
}
