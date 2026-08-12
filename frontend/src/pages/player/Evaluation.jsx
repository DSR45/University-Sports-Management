import { useState, useEffect } from 'react';
import { Award, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';
import ScoreBar from '../../components/common/ScoreBar';
import { playerService } from '../../services/playerService';

export default function Evaluation() {
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    fetchEvaluation();
  }, []);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      const res = await playerService.getMyEvaluation();
      setEvaluation(res.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setEvaluation(null);
      } else {
        console.error('Failed to fetch evaluation:', error);
        toast.error('Failed to load evaluation');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading evaluation...</span>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Award size={32} />
        </div>
        <h3>No Evaluation Yet</h3>
        <p>
          Your performance evaluation is pending. The coaching staff will review your 
          trial performance and provide detailed feedback soon.
        </p>
        <div style={{ 
          marginTop: '20px',
          padding: '14px',
          background: '#fff8e9',
          borderRadius: '8px',
          fontSize: '11px',
          color: '#92400e',
          maxWidth: '500px'
        }}>
          <strong style={{ display: 'block', marginBottom: '4px' }}>What happens next?</strong>
          After your trial session, our coaching staff will evaluate your skills across 
          six key areas: serving, reception, attack, blocking, defence, and game sense.
        </div>
      </div>
    );
  }

  const skills = [
    { name: 'Serving', value: evaluation.serving },
    { name: 'Reception', value: evaluation.reception },
    { name: 'Attack', value: evaluation.attack },
    { name: 'Blocking', value: evaluation.blocking },
    { name: 'Defence', value: evaluation.defence },
    { name: 'Game Sense', value: evaluation.gameSense }
  ];

  return (
    <>
      <div className="evaluation-hero">
        <div>
          <span className="eyebrow">PERFORMANCE REVIEW</span>
          <h1>Your Evaluation Results</h1>
          <p className="muted">
            Detailed assessment of your volleyball skills and performance.
          </p>
        </div>

        <div className="total-score">
          <span>TOTAL SCORE</span>
          <strong>
            {evaluation.totalScore}
            <small>/60</small>
          </strong>
        </div>
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-header">
            <div>
              <span className="eyebrow">SKILL BREAKDOWN</span>
              <h3>Individual Ratings</h3>
            </div>
          </div>

          <div className="score-list">
            {skills.map((skill) => (
              <ScoreBar
                key={skill.name}
                label={skill.name}
                value={skill.value}
                max={10}
              />
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <span className="eyebrow">FEEDBACK</span>
              <h3>Coach's Notes</h3>
            </div>
          </div>

          {evaluation.notes ? (
            <div className="notes">
              {evaluation.notes}
            </div>
          ) : (
            <p style={{ color: '#9aa3b1', fontStyle: 'italic' }}>
              No additional notes provided.
            </p>
          )}

          <div className="evaluation-date">
            <User size={14} />
            <span>Evaluated by {evaluation.adminName}</span>
          </div>

          <div className="evaluation-date">
            <Calendar size={14} />
            <span>
              Last updated: {new Date(evaluation.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </section>
      </div>

      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-header">
          <div>
            <span className="eyebrow">PERFORMANCE INSIGHTS</span>
            <h3>Understanding Your Scores</h3>
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginTop: '15px'
        }}>
          <InsightCard
            title="Strongest Skill"
            value={getStrongestSkill(skills)}
            color="#10b981"
          />
          <InsightCard
            title="Area for Improvement"
            value={getWeakestSkill(skills)}
            color="#f59e0b"
          />
          <InsightCard
            title="Average Score"
            value={`${(evaluation.totalScore / 6).toFixed(1)}/10`}
            color="#3b82f6"
          />
        </div>
      </div>
    </>
  );
}

function getStrongestSkill(skills) {
  const strongest = skills.reduce((max, skill) => 
    skill.value > max.value ? skill : max
  );
  return `${strongest.name} (${strongest.value}/10)`;
}

function getWeakestSkill(skills) {
  const weakest = skills.reduce((min, skill) => 
    skill.value < min.value ? skill : min
  );
  return `${weakest.name} (${weakest.value}/10)`;
}

function InsightCard({ title, value, color }) {
  return (
    <div style={{
      padding: '16px',
      background: '#f8f9fb',
      borderRadius: '8px',
      borderLeft: `3px solid ${color}`
    }}>
      <div style={{
        fontSize: '9px',
        color: '#9aa3b1',
        fontWeight: '700',
        marginBottom: '6px',
        letterSpacing: '0.05em'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '14px',
        fontWeight: '700',
        color: '#1a1f36'
      }}>
        {value}
      </div>
    </div>
  );
}
