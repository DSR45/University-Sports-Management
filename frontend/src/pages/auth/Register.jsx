import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Volleyball, Eye, EyeOff } from "lucide-react";
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeRegistrationNo: '',
    phone: '',
    year: '',
    position: '',
    heightCm: ''
  });
  const [errors, setErrors] = useState({});

  const positions = [
    'SETTER',
    'OUTSIDE_HITTER',
    'OPPOSITE',
    'MIDDLE_BLOCKER',
    'LIBERO'
  ];
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.collegeRegistrationNo.trim()) {
      newErrors.collegeRegistrationNo = 'Registration number is required';
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.year || formData.year < 1 || formData.year > 4) {
      newErrors.year = 'Year must be between 1 and 4';
    }
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.heightCm || formData.heightCm < 100 || formData.heightCm > 250) {
      newErrors.heightCm = 'Height must be between 100 and 250 cm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year),
        heightCm: parseFloat(formData.heightCm)
      };

      await register(payload);
      navigate('/home');
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is already handled by AuthContext and toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <Volleyball size={28} />
        </div>

        <span className="eyebrow">PLAYER REGISTRATION</span>

        <h1>Join MUJ Volleyball</h1>
        <p>
          Register for the volleyball trials and showcase your talent.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="auth-grid">
            <Field
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={loading}
            />

            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={loading}
            />

            <Field
              label="College Registration No."
              name="collegeRegistrationNo"
              placeholder="Enter your college registration number"
              value={formData.collegeRegistrationNo}
              onChange={handleChange}
              error={errors.collegeRegistrationNo}
              disabled={loading}
            />

            <Field
              label="Phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              disabled={loading}
            />

            <Field
              label="Year"
              name="year"
              type="number"
              placeholder="Enter your year of study"
              min="1"
              max="4"
              value={formData.year}
              onChange={handleChange}
              error={errors.year}
              disabled={loading}
            />

            <Field
              label="Height (cm)"
              name="heightCm"
              type="number"
              placeholder="Enter your height in cm"
              min="100"
              max="250"
              value={formData.heightCm}
              onChange={handleChange}
              error={errors.heightCm}
              disabled={loading}
            />
          </div>

          <label className={`field ${errors.position ? 'error' : ''}`}>
            <span>Position</span>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select position</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>
                  {pos.replace('_', ' ')}
                </option>
              ))}
            </select>
            {errors.position && <div className="field-error">{errors.position}</div>}
          </label>

          <label className={`field ${errors.password ? 'error' : ''}`}>
            <span>Password</span>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create password (min 8 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
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
            {errors.password && <div className="field-error">{errors.password}</div>}
          </label>

          <button
            type="submit"
            className={`primary auth-button ${loading ? 'button-loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Player Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already registered?
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', placeholder, value, onChange, error, disabled, ...props }) {
  return (
    <label className={`field ${error ? 'error' : ''}`}>
      <span>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        {...props}
      />
      {error && <div className="field-error">{error}</div>}
    </label>
  );
}
