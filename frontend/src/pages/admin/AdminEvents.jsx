import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Edit3, Trash2, MapPin, Clock, X, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { mockEvents } from '../../data/mock/events';

export default function AdminEvents() {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().substring(0, 10),
    time: '04:00 PM',
    location: 'MUJ Outdoor Volleyball Complex',
    type: 'Trial',
    description: '',
    registrationOpen: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await adminService.getEvents();
      setEventsList(res.data && res.data.length > 0 ? res.data : mockEvents);
    } catch (err) {
      const stored = localStorage.getItem('muj_admin_events');
      setEventsList(stored ? JSON.parse(stored) : mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = (updated) => {
    setEventsList(updated);
    localStorage.setItem('muj_admin_events', JSON.stringify(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      toast.error('Title, Date, and Location are required');
      return;
    }

    try {
      if (editingEvent) {
        await adminService.updateEvent(editingEvent.id, formData).catch(() => {});
        const updated = eventsList.map((item) =>
          item.id === editingEvent.id ? { ...item, ...formData } : item
        );
        saveToStorage(updated);
        toast.success('Event updated successfully!');
      } else {
        const newEvent = {
          id: `event-${Date.now()}`,
          ...formData
        };
        await adminService.createEvent(newEvent).catch(() => {});
        const updated = [newEvent, ...eventsList];
        saveToStorage(updated);
        toast.success('New event / trial created!');
      }
      setIsModalOpen(false);
      setEditingEvent(null);
      resetForm();
    } catch (err) {
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await adminService.deleteEvent(id).catch(() => {});
        const updated = eventsList.filter((e) => e.id !== id);
        saveToStorage(updated);
        toast.success('Event deleted');
      } catch (err) {
        toast.error('Failed to delete event');
      }
    }
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      date: event.date ? event.date.substring(0, 10) : '',
      time: event.time || '04:00 PM',
      location: event.location || '',
      type: event.type || 'Trial',
      description: event.description || '',
      registrationOpen: event.registrationOpen !== false
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().substring(0, 10),
      time: '04:00 PM',
      location: 'MUJ Outdoor Volleyball Complex',
      type: 'Trial',
      description: '',
      registrationOpen: true
    });
  };

  const filteredEvents = eventsList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    (item.location && item.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="hero-row flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">EVENT & TRIALS MANAGEMENT</span>
          <h1 className="text-2xl font-extrabold text-white">Events & Trials</h1>
          <p className="muted text-xs">
            Schedule open trials, training camps, and inter-university meets.
          </p>
        </div>

        <button
          className="primary flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
          onClick={() => {
            setEditingEvent(null);
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} />
          <span>Add Event / Trial</span>
        </button>
      </div>

      <div className="card p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search event title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Total Events: <strong className="text-white">{filteredEvents.length}</strong>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between transition hover:border-indigo-500/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/20 text-[10px] uppercase tracking-wider">
                    {item.type || 'Event'}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.registrationOpen !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {item.registrationOpen !== false ? 'Registration Open' : 'Closed'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-3">{item.title}</h3>

                <div className="space-y-1.5 text-xs text-slate-400 mb-4 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-400" />
                    <span>{item.date ? item.date.substring(0, 10) : 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-indigo-400" />
                    <span>{item.time || 'All Day'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-400" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
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
                {editingEvent ? 'Edit Event / Trial' : 'Create New Event'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-200">
              <div>
                <label className="font-semibold block mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Squad Open Trials 2025"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="font-semibold block mb-1">Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="04:00 PM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Event Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Trial">Trial / Selection</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Training">Training Camp</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Registration Status</label>
                  <select
                    value={formData.registrationOpen}
                    onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.value === 'true' })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="true">Open</option>
                    <option value="false">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. MUJ Sports Complex Court 1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event details, guidelines, and requirements..."
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
