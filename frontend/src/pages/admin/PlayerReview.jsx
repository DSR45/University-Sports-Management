import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Mail, Phone, User } from 'lucide-react';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/common/StatusBadge';
import { playerService } from '../../services/playerService';
import { evaluationService } from '../../services/evaluationService';

export default function PlayerReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [player, setPlayer] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [evaluationForm, setEvaluationForm] = useState({
    serving: 0,
    reception: 0,
    attack: 0,
    blocking: 0,
    defence: 0,
    gameSense: 0,
    notes: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statuses = ['PENDING', 'SHORTLISTED', 'SELECTED', 'REJECTED'];

  useEffect(() => {
    fetchPlayerData();
  }, [id]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      
      const playerRes = await playerService.getPlayerById(id);
      setPlayer(playerRes.data);

      try {
        const evalRes = await evaluationService.getEvaluation(id);
        setEvaluation(evalRes.data);
        setEvaluationForm({
          serving: evalRes.data.serving,
          reception: evalRes.data.reception,
          attack: evalRes.data.attack,
          blocking: evalRes.data.blocking,
          defence: evalRes.data.defence,
          gameSense: evalRes.data.gameSense,
          notes: evalRes.data.notes || ''
        });
      } catch (error) {
        setEvaluation(null);
      }

    } catch (error) {
      console.error('Failed to fetch player data:', error);
      toast.error('Failed to load player data');
      navigate('/admin/players');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await playerService.updatePlayerStatus(id, newStatus);
      setPlayer({ ...player, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleEvaluationChange = (field, value) => {
    const numValue = Math.max(0, Math.min(10, Number(value)));
    setEvaluationForm({ ...evaluationForm, [field]: numValue });
  };

  const handleSaveEvaluation = async () => {
    try {
      setSaving(true);
      
      if (evaluation) {
        await evaluationService.updateEvaluation(id, evaluationForm);
        toast.success('Evaluation updated successfully!');
      } else {
        await evaluationService.createEvaluation(id, evaluationForm);
        toast.success('Evaluation created successfully!');
      }
      
      await fetchPlayerData();
    } catch (error) {
      console.error('Failed to save evaluation:', error);
      toast.error('Failed to save evaluation');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlayer = async () => {
    try {
      await playerService.deletePlayer(id);
      toast.success('Player deleted successfully');
      navigate('/admin/players');
    } catch (error) {
      console.error('Failed to delete player:', error);
      toast.error('Failed to delete player');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading player details...</span>
      </div>
    );
  }

  if (!player) return null;

  const totalScore = Object.values(evaluationForm)
    .filter(v => typeof v === 'number')
    .reduce((sum, val) => sum + val, 0);

  return (
    <>
      <button 
        className="secondary" 
        onClick={() => navigate('/admin/players')}
        style={{ marginBottom: '20px' }}
      >
        <ArrowLeft size={16} />
        Back to Players
      </button>

      <div className="review-header">
        <div className="large-avatar">
          {player.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>

        <div className="review-name">
          <span className="eyebrow">PLAYER REVIEW</span>
          <h1>{player.name}</h1>
          <p>{player.email}</p>
        </div>

        <StatusBadge status={player.status} />

        <button
          className="secondary"
          onClick={() => setShowDeleteConfirm(true)}
          style={{ marginLeft: 'auto', color: '#ef4444', borderColor: '#fecaca' }}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-header">
            <div>
              <span className="eyebrow">PLAYER INFORMATION</span>
              <h3>Personal Details</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InfoRow icon={User} label="Registration No" value={player.collegeRegistrationNo} />
            <InfoRow icon={Mail} label="Email" value={player.email} />
            <InfoRow icon={Phone} label="Phone" value={player.phone} />
            <div style={{ height: '1px', background: '#edf0f3', margin: '4px 0' }} />
            <InfoRow label="Position" value={player.position.replace('_', ' ')} />
            <InfoRow label="Year" value={`Year ${player.year}`} />
            <InfoRow label="Height" value={`${player.heightCm} cm`} />
            <InfoRow 
              label="Registered" 
              value={new Date(player.createdAt).toLocaleDateString()}
            />
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <span className="eyebrow">STATUS MANAGEMENT</span>
              <h3>Application Status</h3>
            </div>
          </div>

          <div className="status-buttons" style={{ marginTop: '12px' }}>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`status-badge ${status.toLowerCase()}`}
                style={{
                  cursor: 'pointer',
                  padding: '8px 14px',
                  border: player.status === status ? '2px solid currentColor' : 'none'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="card" style={{ marginTop: '18px' }}>
        <div className="card-header">
          <div>
            <span className="eyebrow">PERFORMANCE EVALUATION</span>
            <h3>{evaluation ? 'Update' : 'Create'} Evaluation</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#9aa3b1' }}>Total Score</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1f36' }}>
              {totalScore}/60
            </div>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: '20px' }}>
          {[
            { key: 'serving', label: 'Serving' },
            { key: 'reception', label: 'Setting' },
            { key: 'attack', label: 'Attack' },
            { key: 'blocking', label: 'Blocking' },
            { key: 'defence', label: 'Defence' },
            { key: 'gameSense', label: 'Game Sense' }
          ].map(({ key, label }) => (
            <label key={key} className="field">
              <span>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={evaluationForm[key]}
                  onChange={(e) => handleEvaluationChange(key, e.target.value)}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={evaluationForm[key]}
                  onChange={(e) => handleEvaluationChange(key, e.target.value)}
                  style={{ width: '60px', textAlign: 'center' }}
                />
              </div>
            </label>
          ))}
        </div>

        <label className="field" style={{ marginTop: '20px' }}>
          <span>Coach's Notes</span>
          <textarea
            value={evaluationForm.notes}
            onChange={(e) => setEvaluationForm({ ...evaluationForm, notes: e.target.value })}
            placeholder="Add detailed feedback..."
            rows="4"
          />
        </label>

        <button
          className="primary"
          onClick={handleSaveEvaluation}
          disabled={saving}
          style={{ marginTop: '16px' }}
        >
          <Save size={16} />
          {saving ? 'Saving...' : evaluation ? 'Update Evaluation' : 'Create Evaluation'}
        </button>
      </section>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Player</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete {player.name}?</p>
            </div>
            <div className="modal-footer">
              <button className="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button 
                className="primary" 
                onClick={handleDeletePlayer}
                style={{ background: '#ef4444' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {Icon && (
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: '#f8f9fb',
          display: 'grid',
          placeItems: 'center',
          color: '#9aa3b1'
        }}>
          <Icon size={16} />
        </div>
      )}
      <div>
        <div style={{ fontSize: '9px', color: '#9aa3b1' }}>{label}</div>
        <div style={{ fontSize: '11px', fontWeight: '600' }}>{value}</div>
      </div>
    </div>
  );
}
