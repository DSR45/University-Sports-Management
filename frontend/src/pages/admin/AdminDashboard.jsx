import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  ClipboardCheck,
  TrendingUp,
  Award
} from "lucide-react";
import { toast } from 'react-toastify';
import StatCard from "../../components/common/StatCard";
import { adminService } from '../../services/adminService';
import { playerService } from '../../services/playerService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentPlayers, setRecentPlayers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      const statsRes = await adminService.getDashboardStats();
      setStats(statsRes.data);

            // Fetch recent players
      const playersRes = await playerService.getAllPlayers({
        page: 0,
        size: 5
      });
      setRecentPlayers(playersRes.data.content || []);

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
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="empty-state">
        <h3>Unable to Load Dashboard</h3>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  const evaluationRate = stats.totalPlayers > 0 
    ? Math.round((stats.evaluated / stats.totalPlayers) * 100)
    : 0;

  return (
    <>
      <div className="hero-row">
        <div>
          <span className="eyebrow">ADMIN OVERVIEW</span>
          <h1>Dashboard</h1>
          <p className="muted">
            Monitor trial applications and manage player evaluations.
          </p>
        </div>

        <button 
          className="primary"
          onClick={() => navigate('/admin/players')}
        >
          <Users size={16} />
          Manage Players
        </button>
      </div>

      <div className="stats-grid six">
        <StatCard
          label="Total Players"
          value={stats.totalPlayers}
          icon={Users}
        />

        <StatCard
          label="Pending Review"
          value={stats.pending}
          icon={Clock}
        />

        <StatCard
          label="Shortlisted"
          value={stats.shortlisted}
          icon={Star}
        />

        <StatCard
          label="Selected"
          value={stats.selected}
          icon={CheckCircle}
        />

        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={XCircle}
        />

        <StatCard
          label="Evaluated"
          value={stats.evaluated}
          icon={ClipboardCheck}
        />
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-header">
            <div>
              <span className="eyebrow">RECENT APPLICATIONS</span>
              <h3>Latest Players</h3>
            </div>
            <button 
              className="secondary"
              onClick={() => navigate('/admin/players')}
            >
              View All
            </button>
          </div>

          {recentPlayers.length === 0 ? (
            <p style={{ color: '#9aa3b1', fontSize: '11px' }}>
              No player applications yet.
            </p>
          ) : (
            <div>
              {recentPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="player-row"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/players/${player.id}`)}
                >
                  <div className="avatar">
                    {player.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>

                  <div className="player-main">
                    <strong>{player.name}</strong>
                    <span>{player.position.replace('_', ' ')} • Year {player.year}</span>
                  </div>

                  <span className={`status-badge ${player.status.toLowerCase()}`}>
                    {player.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <span className="eyebrow">INSIGHTS</span>
              <h3>Quick Stats</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <InsightItem
              label="Evaluation Progress"
              value={`${evaluationRate}%`}
              description={`${stats.evaluated} out of ${stats.totalPlayers} players evaluated`}
              icon={TrendingUp}
              color="#3b82f6"
            />

            <InsightItem
              label="Selection Rate"
              value={stats.totalPlayers > 0 ? `${Math.round((stats.selected / stats.totalPlayers) * 100)}%` : '0%'}
              description={`${stats.selected} players selected from ${stats.totalPlayers} applications`}
              icon={Award}
              color="#10b981"
            />

            <InsightItem
              label="Pending Actions"
              value={stats.pending}
              description="Applications awaiting review"
              icon={Clock}
              color="#f59e0b"
            />
          </div>
        </section>
      </div>

      <section className="card" style={{ marginTop: '18px' }}>
        <div className="card-header">
          <div>
            <span className="eyebrow">DISTRIBUTION</span>
            <h3>Status Breakdown</h3>
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '15px'
        }}>
          <StatusBar
            label="Pending"
            count={stats.pending}
            total={stats.totalPlayers}
            color="#9ca3af"
          />
          <StatusBar
            label="Shortlisted"
            count={stats.shortlisted}
            total={stats.totalPlayers}
            color="#f59e0b"
          />
          <StatusBar
            label="Selected"
            count={stats.selected}
            total={stats.totalPlayers}
            color="#10b981"
          />
          <StatusBar
            label="Rejected"
            count={stats.rejected}
            total={stats.totalPlayers}
            color="#ef4444"
          />
        </div>
      </section>
    </>
  );
}

function InsightItem({ label, value, description, icon: Icon, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '14px',
      background: '#f8f9fb',
      borderRadius: '8px'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: `${color}15`,
        color: color,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0
      }}>
        <Icon size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '9px',
          color: '#9aa3b1',
          fontWeight: '700',
          marginBottom: '4px',
          letterSpacing: '0.05em'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#1a1f36',
          marginBottom: '4px'
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '10px',
          color: '#8792a2',
          lineHeight: '1.5'
        }}>
          {description}
        </div>
      </div>
    </div>
  );
}

function StatusBar({ label, count, total, color }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#1a1f36' }}>
          {label}
        </span>
        <span style={{ fontSize: '11px', fontWeight: '700', color }}>
          {count}
        </span>
      </div>
      <div style={{
        height: '8px',
        borderRadius: '10px',
        background: '#edf0f3',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: color,
          borderRadius: 'inherit',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <div style={{
        fontSize: '9px',
        color: '#9aa3b1',
        marginTop: '4px'
      }}>
        {percentage.toFixed(1)}% of total
      </div>
    </div>
  );
}
