import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ClipboardCheck,
  Volleyball,
  ChevronRight,
  Calendar,
  TrendingUp
} from "lucide-react";
import { toast } from 'react-toastify';

import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { playerService } from '../../services/playerService';
import { announcementService } from '../../services/announcementService';

export default function PlayerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch player profile
      const profileRes = await playerService.getMyProfile();
      setPlayer(profileRes.data);

      // Fetch evaluation if exists
      try {
        const evalRes = await playerService.getMyEvaluation();
        setEvaluation(evalRes.data);
      } catch (error) {
        // Evaluation might not exist yet
        setEvaluation(null);
      }

      // Fetch announcements
      const announcementsRes = await announcementService.getAnnouncements({
        page: 0,
        size: 3
      });
      setAnnouncements(announcementsRes.data.content || []);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Volleyball size={32} />
        </div>
        <h3>Profile Not Found</h3>
        <p>Unable to load your player profile. Please try again.</p>
      </div>
    );
  }

  const firstName = player.name.split(' ')[0];

  return (
    <>
      <div className="hero-row">
        <div>
          <span className="eyebrow">YOUR APPLICATION</span>
          <h1>Welcome back, {firstName} 👋</h1>
          <p className="muted">
            Here's the latest update on your volleyball trial application.
          </p>
        </div>

        <button
          className="primary"
          onClick={() => navigate('/player/trial-status')}
        >
          View Trial Status
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="stats-grid three">
        <StatCard
          label="Current Status"
          value={<StatusBadge status={player.status} />}
          icon={CheckCircle2}
        />

        <StatCard
          label="Evaluation Score"
          value={evaluation ? `${evaluation.totalScore}/60` : 'Pending'}
          icon={ClipboardCheck}
        />

        <StatCard
          label="Position"
          value={player.position.replace('_', ' ')}
          icon={Volleyball}
        />
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-header">
            <div>
              <span className="eyebrow">LATEST ANNOUNCEMENT</span>
              <h3>
                {announcements.length > 0
                  ? announcements[0].title
                  : 'No announcements yet'}
              </h3>
            </div>
            {announcements.length > 0 && (
              <span className="date">
                {new Date(announcements[0].createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {announcements.length > 0 ? (
            <>
              <p>{announcements[0].message}</p>
              <button
                className="text-button"
                onClick={() => navigate('/player/announcements')}
              >
                Read all announcements
                <ChevronRight size={16} />
              </button>
            </>
          ) : (
            <p style={{ color: '#9aa3b1' }}>
              No announcements have been posted yet. Check back soon for updates!
            </p>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <span className="eyebrow">PROFILE</span>
              <h3>Player Information</h3>
            </div>
          </div>

          <div className="mini-grid">
            <Info
              label="Registration No."
              value={player.collegeRegistrationNo}
            />
            <Info
              label="Year"
              value={`Year ${player.year}`}
            />
            <Info
              label="Height"
              value={`${player.heightCm} cm`}
            />
            <Info
              label="Phone"
              value={player.phone}
            />
          </div>

          <button
            className="text-button"
            onClick={() => navigate('/player/profile')}
          >
            Edit Profile
            <ChevronRight size={16} />
          </button>
        </section>
      </div>

      {evaluation && (
        <section className="card" style={{ marginTop: '18px' }}>
          <div className="card-header">
            <div>
              <span className="eyebrow">PERFORMANCE</span>
              <h3>Quick Evaluation Overview</h3>
            </div>
            <button
              className="secondary"
              onClick={() => navigate('/player/evaluation')}
            >
              View Full Evaluation
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            <QuickStat label="Serving" value={evaluation.serving} />
            <QuickStat label="Reception" value={evaluation.reception} />
            <QuickStat label="Attack" value={evaluation.attack} />
            <QuickStat label="Blocking" value={evaluation.blocking} />
            <QuickStat label="Defence" value={evaluation.defence} />
            <QuickStat label="Game Sense" value={evaluation.gameSense} />
          </div>
        </section>
      )}
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="info">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function QuickStat({ label, value }) {
  return (
    <div style={{
      padding: '12px',
      background: '#f8f9fb',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '9px',
        color: '#9aa3b1',
        marginBottom: '6px',
        fontWeight: '700'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '20px',
        fontWeight: '700',
        color: '#1a1f36'
      }}>
        {value}<span style={{ fontSize: '12px', color: '#9aa3b1' }}>/10</span>
      </div>
    </div>
  );
}
