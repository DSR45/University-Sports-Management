import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Search, Edit3, Trash2, Calendar, MapPin, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { mockMatches } from '../../data/mock/matches';

export default function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

    const [formData, setFormData] = useState({
    opponent: '',
    competition: 'Inter-University Championship',
    opponentLogo: '',
    date: new Date().toISOString().substring(0, 10),
    time: '17:00',
    venue: 'MUJ Sports Complex Court 1',
    status: 'UPCOMING',
    result: '',
    sets: ''
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await adminService.getMatches();
      setMatches(res.data && res.data.length > 0 ? res.data : mockMatches);
    } catch (err) {
      const stored = localStorage.getItem('muj_admin_matches');
      setMatches(stored ? JSON.parse(stored) : mockMatches);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = (updated) => {
    setMatches(updated);
    localStorage.setItem('muj_admin_matches', JSON.stringify(updated));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.opponent || !formData.date || !formData.time || !formData.venue || !formData.competition || !formData.status) {
      toast.error('Opponent, date, time, venue, competition, and status are required');
      return;
    }

    try {
      if (editingMatch) {
        await adminService.updateMatch(editingMatch.id, formData);
        const updated = matches.map((m) => (m.id === editingMatch.id ? { ...m, ...formData } : m));
        saveToStorage(updated);
        toast.success('Match details updated!');
      } else {
        const res = await adminService.createMatch(formData);
        const created = res.data || {
          id: `match-${Date.now()}`,
          ...formData
        };
        const updated = [created, ...matches];
        saveToStorage(updated);
        toast.success('Match created successfully!');
      }
      setIsModalOpen(false);
      setEditingMatch(null);
      resetForm();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save match';
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this match record?')) {
      try {
        await adminService.deleteMatch(id).catch(() => {});
        const updated = matches.filter((m) => m.id !== id);
        saveToStorage(updated);
        toast.success('Match record deleted');
      } catch (err) {
        toast.error('Failed to delete match');
      }
    }
  };

    const openEdit = (match) => {
    setEditingMatch(match);
    setFormData({
      opponent: match.opponent || '',
      competition: match.competition || match.tournamentName || 'Inter-University Championship',
      opponentLogo: match.opponentLogo || '',
      date: match.date ? match.date.substring(0, 10) : '',
      time: match.time ? match.time.substring(0, 5) : '17:00',
      venue: match.venue || 'MUJ Outdoor Complex',
      status: match.status || 'UPCOMING',
      result: match.result || `${match.mujScore ?? 0} - ${match.opponentScore ?? 0}`,
      sets: match.sets || match.setBreakdown || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      opponent: '',
      competition: 'Inter-University Championship',
      opponentLogo: '',
      date: new Date().toISOString().substring(0, 10),
      time: '17:00',
      venue: 'MUJ Outdoor Complex',
      status: 'UPCOMING',
      result: '',
      sets: ''
    });
  };

  const filteredMatches = matches.filter(
    (m) =>
      m.opponent.toLowerCase().includes(search.toLowerCase()) ||
      ((m.competition || m.tournamentName || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="hero-row flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">FIXTURES & MATCH CENTER</span>
          <h1 className="text-2xl font-extrabold text-white">Matches & Scores</h1>
          <p className="muted text-xs">
            Manage upcoming tournament fixtures, update set scores, and record final match results.
          </p>
        </div>

        <button
          className="primary flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
          onClick={() => {
            setEditingMatch(null);
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} />
          <span>Add New Match</span>
        </button>
      </div>

      <div className="card p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search opponent or tournament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Total Matches: <strong className="text-white">{filteredMatches.length}</strong>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading match center...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-indigo-500/30 transition"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-[10px] uppercase tracking-wider">
                    {m.competition || m.tournamentName || 'Tournament'}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      m.status === 'COMPLETED'
                                              ? 'bg-emerald-500/10 text-emerald-400'
                                              : m.status === 'CANCELLED'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-indigo-500/10 text-indigo-400'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="text-center py-4 bg-slate-950/60 rounded-xl border border-slate-800 mb-4">
                  <div className="flex items-center justify-around font-extrabold text-white text-base">
                    <span>MUJ</span>
                    <span className="text-indigo-400 text-xl font-black">
                      {m.result || `${m.mujScore ?? 0} - ${m.opponentScore ?? 0}`}
                    </span>
                    <span>{m.opponent}</span>
                  </div>
                                    {(m.sets || m.setBreakdown) && (
                    <div className="text-[10px] text-slate-400 mt-2 font-mono">{m.sets || m.setBreakdown}</div>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-400" />
                    <span>{m.date ? m.date.substring(0, 10) : 'TBA'} • {m.time || '05:00 PM'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-400" />
                    <span className="truncate">{m.venue || 'MUJ Sports Complex'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2 mt-4">
                <button
                  onClick={() => openEdit(m)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-semibold transition flex items-center gap-1"
                >
                  <Edit3 size={14} /> Edit Score
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 text-xs font-semibold transition flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingMatch ? 'Edit Match Score' : 'Create New Match'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Opponent Team *</label>
                  <input
                    type="text"
                    value={formData.opponent}
                    onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                    placeholder="e.g. SKIT Jaipur"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tournament / Event</label>
                  <input
                    type="text"
                                        value={formData.competition}
                    onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                    placeholder="e.g. Inter-University Cup"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

                            <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

                            <div>
                <label className="font-semibold block mb-1">Result</label>
                <input
                  type="text"
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  placeholder="e.g. 3 - 1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Set Breakdown (Optional)</label>
                <input
                  type="text"
                                    value={formData.sets}
                  onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                  placeholder="e.g. 25-21, 23-25, 25-18, 25-20"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. MUJ Sports Complex Court 1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg"
                >
                  Save Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}