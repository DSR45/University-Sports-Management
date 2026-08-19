import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  Edit3,
  Image,
  Info,
  Plus,
  Save,
  Search,
  Trash2,
  Trophy,
  Video,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';

const FIELD_CLASS = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500';
const STATUS_OPTIONS = ['UPCOMING', 'PAST', 'CANCELLED'];
const MATCH_STATUS_OPTIONS = ['UPCOMING', 'COMPLETED', 'CANCELLED'];
const GALLERY_CATEGORIES = ['MATCHES', 'TRAINING', 'EVENTS', 'OTHER'];
const VIDEO_CATEGORIES = ['HIGHLIGHTS', 'TRAINING', 'OTHER'];

const resourceConfig = {
  achievements: {
    eyebrow: 'ACHIEVEMENT MANAGEMENT',
    title: 'Achievements',
    description: 'Maintain trophies, tournament results, and major team milestones.',
    addLabel: 'Add Achievement',
    icon: Award,
    storageKey: 'muj_admin_achievements',
    get: adminService.getAchievements,
    create: adminService.createAchievement,
    update: adminService.updateAchievement,
    delete: adminService.deleteAchievement,
    emptyForm: {
      year: new Date().getFullYear().toString(),
      title: '',
      competition: '',
      description: '',
      image: ''
    },
    required: ['year', 'title', 'competition'],
    searchFields: ['title', 'competition', 'year'],
    cardMeta: (item) => item.year,
    cardSubtitle: (item) => item.competition,
    fields: [
      { name: 'year', label: 'Year *', type: 'text', required: true },
      { name: 'title', label: 'Title *', type: 'text', required: true },
      { name: 'competition', label: 'Competition *', type: 'text', required: true },
      { name: 'image', label: 'Image URL', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 }
    ]
  },
  gallery: {
    eyebrow: 'PHOTO GALLERY MANAGEMENT',
    title: 'Photo Gallery',
    description: 'Add and remove public gallery images with backend-compatible categories.',
    addLabel: 'Add Gallery Image',
    icon: Image,
    storageKey: 'muj_admin_gallery',
    get: adminService.getGallery,
    create: adminService.createGalleryItem,
    delete: adminService.deleteGalleryItem,
    emptyForm: {
      title: '',
      image: '',
      category: 'MATCHES',
      date: new Date().toISOString().substring(0, 10)
    },
    required: ['title', 'image'],
    searchFields: ['title', 'category'],
    cardMeta: (item) => item.category,
    cardSubtitle: (item) => item.date,
    fields: [
      { name: 'title', label: 'Title *', type: 'text', required: true },
      { name: 'image', label: 'Image URL *', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: GALLERY_CATEGORIES },
      { name: 'date', label: 'Date', type: 'date' }
    ]
  },
  videos: {
    eyebrow: 'VIDEO HIGHLIGHTS MANAGEMENT',
    title: 'Video Highlights',
    description: 'Manage highlight reels, training videos, and embedded match content.',
    addLabel: 'Add Video',
    icon: Video,
    storageKey: 'muj_admin_videos',
    get: adminService.getVideos,
    create: adminService.createVideo,
    update: adminService.updateVideo,
    delete: adminService.deleteVideo,
    emptyForm: {
      title: '',
      thumbnail: '',
      videoUrl: '',
      category: 'HIGHLIGHTS',
      date: new Date().toISOString().substring(0, 10)
    },
    required: ['title', 'videoUrl'],
    searchFields: ['title', 'category'],
    cardMeta: (item) => item.category,
    cardSubtitle: (item) => item.date,
    fields: [
      { name: 'title', label: 'Title *', type: 'text', required: true },
      { name: 'videoUrl', label: 'Video URL *', type: 'text', required: true },
      { name: 'thumbnail', label: 'Thumbnail URL', type: 'text' },
      { name: 'category', label: 'Category', type: 'select', options: VIDEO_CATEGORIES },
      { name: 'date', label: 'Date', type: 'date' }
    ]
  }
};

export function AdminResourceManager({ type }) {
  const config = resourceConfig[type];
  const Icon = config.icon;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(config.emptyForm);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((item) =>
      config.searchFields.some((field) => String(item[field] || '').toLowerCase().includes(term))
    );
  }, [items, search, config]);

  useEffect(() => {
    fetchItems();
  }, [type]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await config.get();
      const data = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setItems(data);
      localStorage.setItem(config.storageKey, JSON.stringify(data));
    } catch (err) {
      const stored = localStorage.getItem(config.storageKey);
      setItems(stored ? JSON.parse(stored) : []);
    } finally {
      setLoading(false);
    }
  };

  const persist = (updated) => {
    setItems(updated);
    localStorage.setItem(config.storageKey, JSON.stringify(updated));
  };

  const resetForm = () => {
    setFormData(config.emptyForm);
    setEditingItem(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...config.emptyForm, ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = config.required.find((field) => !String(formData[field] || '').trim());
    if (missing) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      if (editingItem && config.update) {
        await config.update(editingItem.id, formData).catch(() => {});
        persist(items.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item)));
        toast.success(`${config.title.slice(0, -1)} updated`);
      } else {
        const newItem = { id: `${type}-${Date.now()}`, ...formData };
        await config.create(newItem).catch(() => {});
        persist([newItem, ...items]);
        toast.success(`${config.title.slice(0, -1)} created`);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      toast.error('Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? This action cannot be undone.')) return;

    try {
      await config.delete(id).catch(() => {});
      persist(items.filter((item) => item.id !== id));
      toast.success('Item deleted');
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="hero-row flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">{config.eyebrow}</span>
          <h1 className="text-2xl font-extrabold text-white">{config.title}</h1>
          <p className="muted text-xs">{config.description}</p>
        </div>

        <button className="primary flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20" onClick={openCreate}>
          <Plus size={16} />
          <span>{config.addLabel}</span>
        </button>
      </div>

      <div className="card p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${config.title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Total: <strong className="text-white">{filteredItems.length}</strong>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading {config.title.toLowerCase()}...</div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-xs">
          No records found. Use “{config.addLabel}” to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-indigo-500/30 transition">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-[10px] uppercase tracking-wider">
                    {config.cardMeta(item) || 'Entry'}
                  </span>
                  <Icon size={16} className="text-slate-500" />
                </div>
                {item.image || item.thumbnail ? (
                  <img src={item.image || item.thumbnail} alt={item.title} className="w-full h-32 object-cover rounded-xl border border-slate-800 mb-4" />
                ) : null}
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-indigo-300 mb-2">{config.cardSubtitle(item)}</p>
                {item.description && <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{item.description}</p>}
                {item.videoUrl && <p className="text-[10px] text-slate-500 truncate font-mono">{item.videoUrl}</p>}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2 mt-4">
                {config.update && (
                  <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-semibold transition flex items-center gap-1">
                    <Edit3 size={14} /> Edit
                  </button>
                )}
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 text-xs font-semibold transition flex items-center gap-1">
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
              <h3 className="text-base font-bold text-white">{editingItem ? `Edit ${config.title}` : config.addLabel}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-200">
              {config.fields.map((field) => (
                <div key={field.name}>
                  <label className="font-semibold block mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea rows={field.rows || 3} value={formData[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className={FIELD_CLASS} required={field.required} />
                  ) : field.type === 'select' ? (
                    <select value={formData[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className={FIELD_CLASS}>
                      {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} value={formData[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className={FIELD_CLASS} required={field.required} />
                  )}
                </div>
              ))}

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                  <Save size={14} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminAchievements() {
  return <AdminResourceManager type="achievements" />;
}

export function AdminGallery() {
  return <AdminResourceManager type="gallery" />;
}

export function AdminVideos() {
  return <AdminResourceManager type="videos" />;
}

export function AdminTeamInfo() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    season: '',
    description: '',
    philosophy: '',
    vision: '',
    history: ''
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await adminService.getTeamInfo();
        setFormData((prev) => ({ ...prev, ...(res.data || {}) }));
      } catch (err) {
        const stored = localStorage.getItem('muj_admin_team_info');
        if (stored) setFormData((prev) => ({ ...prev, ...JSON.parse(stored) }));
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateTeamInfo(formData).catch(() => {});
      localStorage.setItem('muj_admin_team_info', JSON.stringify(formData));
      toast.success('Team information updated');
    } catch (err) {
      toast.error('Failed to update team information');
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-400 text-xs">Loading team info...</div>;

  return (
    <div className="space-y-6">
      <div className="hero-row">
        <div>
          <span className="eyebrow">ABOUT SECTION SETTINGS</span>
          <h1 className="text-2xl font-extrabold text-white">Team Info</h1>
          <p className="muted text-xs">Update the public team identity, season, philosophy, vision, and history.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-4 text-xs text-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Team Name" name="name" value={formData.name} setFormData={setFormData} />
          <Field label="Season" name="season" value={formData.season} setFormData={setFormData} />
        </div>
        <Field label="Description" name="description" value={formData.description} setFormData={setFormData} textarea />
        <Field label="Philosophy" name="philosophy" value={formData.philosophy} setFormData={setFormData} />
        <Field label="Vision" name="vision" value={formData.vision} setFormData={setFormData} textarea />
        <Field label="History" name="history" value={formData.history} setFormData={setFormData} textarea rows={5} />

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg flex items-center gap-2">
            <Info size={14} /> Save Team Info
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, setFormData, textarea = false, rows = 3 }) {
  return (
    <div>
      <label className="font-semibold block mb-1">{label}</label>
      {textarea ? (
        <textarea rows={rows} value={value || ''} onChange={(e) => setFormData((prev) => ({ ...prev, [name]: e.target.value }))} className={FIELD_CLASS} />
      ) : (
        <input type="text" value={value || ''} onChange={(e) => setFormData((prev) => ({ ...prev, [name]: e.target.value }))} className={FIELD_CLASS} />
      )}
    </div>
  );
}

export { MATCH_STATUS_OPTIONS, STATUS_OPTIONS, Trophy, Calendar };