import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Star, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { playerService } from '../../services/playerService';

export default function TrialStatus() {
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await playerService.getMyProfile();
      setPlayer(res.data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
      toast.error('Failed to load trial status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading trial status...</span>
      </div>
    );
  }

  if (!player) return null;

  const statusConfig = {
    PENDING: {
      step: 1,
      icon: Clock,
      color: '#f59e0b',
      bg: '#fff8e9',
      title: 'Application Under Review',
      message: 'Your application has been received and is currently being reviewed by our coaching staff.'
    },
    SHORTLISTED: {
      step: 2,
      icon: Star,
      color: '#3b82f6',
      bg: '#eff6ff',
      title: 'Shortlisted for Trials',
      message: 'Congratulations! You have been shortlisted. Our team will contact you with trial details soon.'
    },
    SELECTED: {
      step: 3,
      icon: CheckCircle,
      color: '#10b981',
      bg: '#d1fae5',
      title: 'Selected for Team',
      message: 'Excellent news! You have been selected for the MUJ Volleyball team. Welcome aboard!'
    },
    REJECTED: {
      step: 0,
      icon: XCircle,
      color: '#ef4444',
      bg: '#fee2e2',
      title: 'Application Not Successful',
      message: 'Thank you for your interest. Unfortunately, we are unable to offer you a position at this time. We encourage you to try again next year.'
    }
  };

  const currentStatus = statusConfig[player.status];
  const StatusIcon = currentStatus.icon;

  const getStepStatus = (step) => {
    if (player.status === 'REJECTED') {
      return step === 0 ? 'current' : '';
    }

    if (player.status === 'SHORTLISTED') {
      return step <= 2 ? 'done' : '';
    }

    if (player.status === 'SELECTED') {
      return step <= 3 ? 'done' : '';
    }

    if (step < currentStatus.step) return 'done';
    if (step === currentStatus.step) return 'current';
    return '';
  };

  return (
    <div className="status-page">
      <div className="card status-card">
        <div className="center-heading">
          <span className="eyebrow">APPLICATION STATUS</span>
          <h1>Trial Progress Tracker</h1>
          <p className="muted">
            Track your journey from application to team selection.
          </p>
        </div>

        {player.status !== 'REJECTED' && (
          <div className="timeline">
            <TimelineStep
              number="1"
              label="Application Submitted"
              date="Received"
              status={getStepStatus(1)}
            />

            <div className={`timeline-line ${getStepStatus(2) === 'done' ? 'done' : ''}`} />

            <TimelineStep
              number="2"
              label="Shortlisted"
              date="In Review"
              status={getStepStatus(2)}
            />

            <div className={`timeline-line ${getStepStatus(3) === 'done' ? 'done' : ''}`} />

            <TimelineStep
              number="3"
              label="Selected"
              date="Final"
              status={getStepStatus(3)}
            />
          </div>
        )}

        <div 
          className="status-message" 
          style={{ 
            background: currentStatus.bg,
            borderColor: currentStatus.color,
            color: currentStatus.color
          }}
        >
          <StatusIcon size={20} />
          <div>
            <strong>{currentStatus.title}</strong>
            <p style={{ color: 'inherit', opacity: 0.8 }}>
              {currentStatus.message}
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f8f9fb',
          borderRadius: '10px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <StatusInfo
              label="Application Date"
              value={new Date(player.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            />
            <StatusInfo
              label="Current Status"
              value={player.status.replace('_', ' ')}
            />
            <StatusInfo
              label="Position Applied"
              value={player.position.replace('_', ' ')}
            />
            <StatusInfo
              label="Registration No."
              value={player.collegeRegistrationNo}
            />
          </div>
        </div>

        {player.status === 'PENDING' && (
          <div style={{
            marginTop: '20px',
            padding: '14px',
            background: '#eff6ff',
            borderRadius: '8px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={16} style={{ color: '#3b82f6', marginTop: '2px' }} />
            <div style={{ fontSize: '11px', color: '#1e40af', lineHeight: '1.6' }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>What's Next?</strong>
              Our coaching staff is carefully reviewing all applications. Shortlisted candidates 
              will be notified via email within 5-7 business days with trial schedule details.
            </div>
          </div>
        )}

        {player.status === 'SHORTLISTED' && (
          <div style={{
            marginTop: '20px',
            padding: '14px',
            background: '#eff6ff',
            borderRadius: '8px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={16} style={{ color: '#3b82f6', marginTop: '2px' }} />
            <div style={{ fontSize: '11px', color: '#1e40af', lineHeight: '1.6' }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Prepare for Trials</strong>
              Check your email for trial date, time, and venue details. Make sure to bring 
              appropriate sports gear and arrive 15 minutes early.
            </div>
          </div>
        )}

        {player.status === 'SELECTED' && (
          <div style={{
            marginTop: '20px',
            padding: '14px',
            background: '#d1fae5',
            borderRadius: '8px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start'
          }}>
            <CheckCircle size={16} style={{ color: '#10b981', marginTop: '2px' }} />
            <div style={{ fontSize: '11px', color: '#065f46', lineHeight: '1.6' }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Welcome to the Team! 🎉</strong>
              You will receive an email with practice schedules, team guidelines, and next steps. 
              We're excited to have you as part of MUJ Volleyball!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineStep({ number, label, date, status }) {
  return (
    <div className={`timeline-step ${status}`}>
      <div className="timeline-dot">{number}</div>
      <strong>{label}</strong>
      <span>{date}</span>
    </div>
  );
}

function StatusInfo({ label, value }) {
  return (
    <div>
      <div style={{
        fontSize: '9px',
        color: '#9aa3b1',
        fontWeight: '700',
        marginBottom: '6px',
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '12px',
        fontWeight: '600',
        color: '#1a1f36'
      }}>
        {value}
      </div>
    </div>
  );
}
