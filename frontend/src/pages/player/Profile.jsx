import { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { playerService } from '../../services/playerService';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [player, setPlayer] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    year: '',
    position: '',
    heightCm: ''
  });

  const positions = [
    'SETTER',
    'OUTSIDE_HITTER',
    'OPPOSITE',
    'MIDDLE_BLOCKER',
    'LIBERO'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await playerService.getMyProfile();
      setPlayer(res.data);
      setFormData({
        phone: res.data.phone,
        year: res.data.year,
        position: res.data.position,
        heightCm: res.data.heightCm
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year),
        heightCm: parseFloat(formData.heightCm)
      };

      await playerService.updateMyProfile(payload);
      toast.success('Profile updated successfully!');
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error('Failed to update profile:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading profile...</span>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <User size={32} />
        </div>
        <h3>Profile Not Found</h3>
        <p>Unable to load your profile. Please try again.</p>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="card">
      <div className="profile-heading">
        <div className="large-avatar">
          {getInitials(player.name)}
        </div>

        <div>
          <span className="eyebrow">PLAYER PROFILE</span>
          <h2>{player.name}</h2>
          <p>{player.email}</p>
        </div>

        <button 
          className="secondary" 
          onClick={handleSubmit}
          disabled={saving}
          style={{ marginLeft: 'auto' }}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="section-title">Personal Information</div>

        <div className="form-grid">
          <label className="field disabled">
            <span>Full Name</span>
            <input value={player.name} disabled />
          </label>

          <label className="field disabled">
            <span>Email Address</span>
            <input value={player.email} disabled />
          </label>

          <label className="field disabled">
            <span>College Registration No.</span>
            <input value={player.collegeRegistrationNo} disabled />
          </label>

          <label className="field">
            <span>Phone Number</span>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              pattern="[0-9]{10}"
              required
            />
          </label>
        </div>

        <div className="section-title" style={{ marginTop: '24px' }}>
          Academic & Physical Details
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Current Year</span>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </label>

          <label className="field">
            <span>Playing Position</span>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            >
              {positions.map(pos => (
                <option key={pos} value={pos}>
                  {pos.replace('_', ' ')}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Height (cm)</span>
            <input
              name="heightCm"
              type="number"
              value={formData.heightCm}
              onChange={handleChange}
              placeholder="183"
              min="100"
              max="250"
              step="0.1"
              required
            />
          </label>

          <label className="field disabled">
            <span>Application Status</span>
            <input value={player.status.replace('_', ' ')} disabled />
          </label>
        </div>

        <div className="locked-note">
          <strong style={{ display: 'block', marginBottom: '4px' }}>🔒 Locked Fields</strong>
          Some fields like name, email, and registration number cannot be changed. 
          If you need to update these, please contact the admin.
        </div>
      </form>
    </div>
  );
}