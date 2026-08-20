import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Search, Edit3, Trash2, MapPin, Calendar, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';

export default function AdminMatches() {
  const [matchesList, setMatchesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

      const [formData, setFormData] = useState({
    opponent: '',
    tournamentName: 'Inter-University Championship',
    ourScore: 3,
    opponentScore: 1,
    date: new Date().toISOString().substring(0, 10),
    venue: 'MUJ Indoor Sports Complex',
    status: 'COMPLETED',
    result: 'WIN',
    highlights: ''
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await adminService.getMatches();
      setMatchesList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const stored = localStorage.getItem('muj_admin_matches');
      setMatchesList(stored ? JSON.parse(stored) : []);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = (updated) => {
    setMatchesList(updated);
    localStorage.setItem('muj_admin_matches', JSON.stringify(updated));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.opponent || !formData.date || !formData.venue) {
        toast.error('Opponent name, date, and venue are required');
        return;
      }

      const targetId = editingMatch ? editingMatch.id : `match-${Date.now()}`;
      const formattedScore = `${formData.ourScore ?? 0} - ${formData.opponentScore ?? 0}`;
      const statusVal = formData.result === 'UPCOMING' ? 'UPCOMING' : 'COMPLETED';

      const matchObj = {
        id: targetId,
        opponent: formData.opponent,
        tournamentName: formData.tournamentName || 'Inter-University Championship',
        competition: formData.tournamentName || 'Inter-University Championship',
        ourScore: Number(formData.ourScore ?? 0),
        opponentScore: Number(formData.opponentScore ?? 0),
        score: formattedScore,
        result: formattedScore,
        outcome: formData.result,
        date: formData.date,
        time: '16:00',
        venue: formData.venue,
        status: statusVal,
        highlights: formData.highlights,
        sets: formData.highlights || formattedScore
      };

      try {
        if (editingMatch) {
          await adminService.updateMatch(editingMatch.id, matchObj).catch(() => {});
          const updated = matchesList.map((item) =>
            item.id === editingMatch.id ? matchObj : item
          );
          saveToStorage(updated);
          toast.success('Match updated successfully!');
        } else {
          await adminService.createMatch(matchObj).catch(() => {});
          const updated = [matchObj, ...matchesList];
          saveToStorage(updated);
          toast.success('New match added!');
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
    if (window.confirm('Are you sure you want to delete this match record?')) {
      try {
        await adminService.deleteMatch(id).catch(() => {});
        const updated = matchesList.filter((m) => m.id !== id);
        saveToStorage(updated);
        toast.success('Match record deleted');
      } catch (err) {
        toast.error('Failed to delete match');
      }
    }
  };

  const openEdit = (match) => {
      setEditingMatch(match);
      let our = match.ourScore;
      let opp = match.opponentScore;
      if ((our === undefined || opp === undefined) && match.result && String(match.result).includes('-')) {
        const parts = String(match.result).split('-');
        our = parseInt(parts[0], 10) || 0;
        opp = parseInt(parts[1], 10) || 0;
      }

      setFormData({
        opponent: match.opponent || '',
        tournamentName: match.tournamentName || match.competition || 'Inter-University Championship',
        ourScore: our ?? 3,
        opponentScore: opp ?? 0,
        date: match.date ? match.date.substring(0, 10) : new Date().toISOString().substring(0, 10),
        venue: match.venue || match.location || '',
        status: match.status || 'COMPLETED',
        result: match.outcome || (our > opp ? 'WIN' : our < opp ? 'LOSS' : 'DRAW'),
        highlights: match.highlights || match.sets || match.description || ''
      });
      setIsModalOpen(true);
    };

  const resetForm = () => {
    setFormData({
      opponent: '',
      tournamentName: 'Inter-University Championship',
      ourScore: 3,
      opponentScore: 1,
      date: new Date().toISOString().substring(0, 10),
      venue: 'MUJ Indoor Sports Complex',
      status: 'COMPLETED',
      result: 'WIN',
      highlights: ''
    });
  };

  const filteredMatches = matchesList.filter((item) =>
    (item.opponent || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.tournamentName || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.venue || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="hero-row flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">MATCH & SCORES MANAGEMENT</span>
          <h1 className="text-2xl font-extrabold text-white">Matches & Scores</h1>
          <p className="muted text-xs">
            Manage team fixtures, tournament match results, and set scores.
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
          <span>Create Match & Score</span>
        </button>
      </div>

      <div className="card p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search opponent, tournament, venue..."
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
        <div className="text-center py-12 text-slate-400 text-xs">Loading matches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between transition hover:border-indigo-500/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/20 text-[10px] uppercase tracking-wider">
                    {item.tournamentName || 'Tournament'}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${item.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : item.result === 'LOSS' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                    {item.result || item.status}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-3 flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="text-[11px] font-bold text-slate-300">MUJ VOLLEYBALL</div>
                    <div className="text-xl font-black text-indigo-400">{item.ourScore ?? 0}</div>
                  </div>
                  <div className="text-xs font-bold text-slate-500 px-2">VS</div>
                  <div className="text-center flex-1">
                    <div className="text-[11px] font-bold text-slate-300 truncate">{item.opponent || 'Opponent'}</div>
                    <div className="text-xl font-black text-rose-400">{item.opponentScore ?? 0}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 mb-3 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-400" />
                    <span>{item.date ? item.date.substring(0, 10) : 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-400" />
                    <span className="truncate">{item.venue || 'MUJ Sports Ground'}</span>
                  </div>
                </div>

                {item.highlights && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">{item.highlights}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEdit(item)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-semibold transition flex items-center gap-1"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
                {editingMatch ? 'Edit Match & Score' : 'Create Match & Score'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-200">
              <div>
                <label className="font-semibold block mb-1">Opponent Team Name *</label>
                <input
                  type="text"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                  placeholder="e.g. LNMIIT Jaipur"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Tournament / League</label>
                  <input
                    type="text"
                    value={formData.tournamentName}
                    onChange={(e) => setFormData({ ...formData, tournamentName: e.target.value })}
                    placeholder="e.g. West Zone Inter-Uni 2025"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Match Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="font-semibold block mb-1 text-indigo-400">MUJ Score (Sets)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.ourScore}
                    onChange={(e) => setFormData({ ...formData, ourScore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-rose-400">Opponent Score (Sets)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.opponentScore}
                    onChange={(e) => setFormData({ ...formData, opponentScore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Match Result</label>
                  <select
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="WIN">WIN</option>
                    <option value="LOSS">LOSS</option>
                    <option value="DRAW">DRAW</option>
                    <option value="UPCOMING">UPCOMING</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Venue *</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. MUJ Sports Complex Court 1"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Match Highlights / Notes</label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Match recap, key set scores, standout performances..."
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
                  Save Match & Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}