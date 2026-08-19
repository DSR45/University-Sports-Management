import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Download, 
  Check, 
  X, 
  Monitor, 
  Smartphone
} from 'lucide-react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [previewPage, setPreviewPage] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  const [formData, setFormData] = useState({
    title: '',
    filename: '',
    path: '',
    category: 'Public Website',
    status: 'Published',
    metaDescription: '',
    keywords: '',
    heroTitle: '',
    heroSubtitle: '',
    ctaText: 'Learn More',
    ctaLink: '#',
    htmlContent: ''
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPages();
      setPages(res.data && res.data.length > 0 ? res.data : getInitialPages());
    } catch (err) {
      const stored = localStorage.getItem('muj_admin_pages');
      if (stored) {
        setPages(JSON.parse(stored));
      } else {
        const initial = getInitialPages();
        setPages(initial);
        localStorage.setItem('muj_admin_pages', JSON.stringify(initial));
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitialPages = () => [
    {
      id: 'page-home',
      title: 'Home & Hero Section',
      filename: 'index.html',
      path: '/',
      category: 'Core Pages',
      status: 'Published',
      metaDescription: 'Manipal University Jaipur Official Volleyball Club portal.',
      keywords: 'muj, volleyball, sports, manipal university jaipur',
      heroTitle: 'MUJ Volleyball Squad',
      heroSubtitle: 'Discipline • Grit • Excellence. Official sports management portal.',
      ctaText: 'Join Squad Trials',
      ctaLink: '/join',
      lastModified: '2025-02-15'
    },
    {
      id: 'page-team',
      title: 'Team & Roster Page',
      filename: 'team.html',
      path: '/team',
      category: 'Public Website',
      status: 'Published',
      metaDescription: 'Meet the players, captains, setters, and coaching staff.',
      keywords: 'team, players, roster, volleyball squad',
      heroTitle: 'Official Roster 2024-25',
      heroSubtitle: 'Meet the athletes representing Manipal University Jaipur.',
      ctaText: 'View Player Stats',
      ctaLink: '#roster',
      lastModified: '2025-02-14'
    },
    {
      id: 'page-matches',
      title: 'Matches & Fixtures Page',
      filename: 'matches.html',
      path: '/matches',
      category: 'Public Website',
      status: 'Published',
      metaDescription: 'Upcoming fixtures, match schedules, scores and detailed set results.',
      keywords: 'matches, fixtures, schedule, scores, results',
      heroTitle: 'Match Center & Schedule',
      heroSubtitle: 'Follow live scores, set breakdowns, and upcoming tournament fixtures.',
      ctaText: 'View Schedule',
      ctaLink: '#fixtures',
      lastModified: '2025-02-13'
    },
    {
      id: 'page-news',
      title: 'News & Media Articles',
      filename: 'news.html',
      path: '/news',
      category: 'Content Pages',
      status: 'Published',
      metaDescription: 'Latest announcements, match reports, and volleyball news.',
      keywords: 'news, articles, coverage, updates',
      heroTitle: 'Latest Sports News',
      heroSubtitle: 'Stay updated with tournament victories, match summaries, and club announcements.',
      ctaText: 'Read Latest News',
      ctaLink: '#news',
      lastModified: '2025-02-12'
    },
    {
      id: 'page-gallery',
      title: 'Photo Gallery',
      filename: 'gallery.html',
      path: '/gallery',
      category: 'Media',
      status: 'Published',
      metaDescription: 'High-res photos from matches, training sessions, and events.',
      keywords: 'gallery, photos, match pictures, training photos',
      heroTitle: 'Action Photo Gallery',
      heroSubtitle: 'Capturing moments of glory, intense training, and team celebrations.',
      ctaText: 'Explore Photos',
      ctaLink: '#gallery',
      lastModified: '2025-02-10'
    },
    {
      id: 'page-about',
      title: 'About Us & History',
      filename: 'about.html',
      path: '/about',
      category: 'Core Pages',
      status: 'Published',
      metaDescription: 'History, vision, coaching philosophy, and sports facilities.',
      keywords: 'about, history, vision, facility, manipal',
      heroTitle: 'About MUJ Volleyball Club',
      heroSubtitle: 'Building champions through dedication, world-class facilities, and teamwork.',
      ctaText: 'Read Our Story',
      ctaLink: '#story',
      lastModified: '2025-02-08'
    },
    {
      id: 'page-achievements',
      title: 'Achievements & Trophies',
      filename: 'achievements.html',
      path: '/achievements',
      category: 'Public Website',
      status: 'Published',
      metaDescription: 'Championship gold medals, state trophies, and individual awards.',
      keywords: 'achievements, trophies, gold medal, championship',
      heroTitle: 'Wall of Fame & Trophies',
      heroSubtitle: 'Honoring our tournament victories and team achievements over the years.',
      ctaText: 'View Medals',
      ctaLink: '#trophies',
      lastModified: '2025-02-05'
    },
    {
      id: 'page-events',
      title: 'Upcoming Events & Trials',
      filename: 'events.html',
      path: '/events',
      category: 'Public Website',
      status: 'Published',
      metaDescription: 'Calendar of trials, workshops, and inter-university meets.',
      keywords: 'events, trials, workshops, calendar',
      heroTitle: 'Sports Events & Open Trials',
      heroSubtitle: 'Join upcoming trial dates, workshops, and exhibition games.',
      ctaText: 'Register for Trial',
      ctaLink: '/join',
      lastModified: '2025-02-04'
    },
    {
      id: 'page-videos',
      title: 'Video Highlights',
      filename: 'videos.html',
      path: '/videos',
      category: 'Media',
      status: 'Published',
      metaDescription: 'Match highlights, championship points, and training drills.',
      keywords: 'videos, highlights, spikes, training drills',
      heroTitle: 'Video Highlights & Spikes',
      heroSubtitle: 'Watch intense rally highlights, match spikes, and tactical breakdowns.',
      ctaText: 'Watch Highlights',
      ctaLink: '#videos',
      lastModified: '2025-02-02'
    },
    {
      id: 'page-join',
      title: 'Join & Tryout Registration',
      filename: 'join.html',
      path: '/join',
      category: 'Forms & Portal',
      status: 'Published',
      metaDescription: 'Submit trial application form for MUJ Volleyball team.',
      keywords: 'join, registration, tryout, apply, student player',
      heroTitle: 'Join MUJ Volleyball Team',
      heroSubtitle: 'Fill out your player details and participate in open team trials.',
      ctaText: 'Apply Now',
      ctaLink: '/register',
      lastModified: '2025-02-01'
    },
    {
      id: 'page-contact',
      title: 'Contact & Support',
      filename: 'contact.html',
      path: '/contact',
      category: 'Core Pages',
      status: 'Published',
      metaDescription: 'Get in touch with coaches, team managers, and sports office.',
      keywords: 'contact, sports desk, coach email, campus map',
      heroTitle: 'Contact Sports Department',
      heroSubtitle: 'Reach out to our coaching staff, sports office, or team captains.',
      ctaText: 'Send Message',
      ctaLink: '#contact-form',
      lastModified: '2025-01-28'
    }
  ];

  const savePagesToStorage = (newPages) => {
    setPages(newPages);
    localStorage.setItem('muj_admin_pages', JSON.stringify(newPages));
  };

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.filename) {
      toast.error('Title and Filename are required');
      return;
    }

    let formattedFilename = formData.filename.trim().toLowerCase();
    if (!formattedFilename.endsWith('.html')) {
      formattedFilename += '.html';
    }

    let formattedPath = formData.path.trim();
    if (!formattedPath) {
      formattedPath = '/' + formattedFilename.replace('.html', '');
    } else if (!formattedPath.startsWith('/')) {
      formattedPath = '/' + formattedPath;
    }

    if (editingPage) {
      const updated = pages.map((p) =>
        p.id === editingPage.id
          ? {
              ...p,
              ...formData,
              filename: formattedFilename,
              path: formattedPath,
              lastModified: new Date().toISOString().split('T')[0]
            }
          : p
      );
      savePagesToStorage(updated);
      toast.success(`Page "${formData.title}" updated successfully!`);
      setEditingPage(null);
    } else {
      const newPage = {
        id: `page-${Date.now()}`,
        ...formData,
        filename: formattedFilename,
        path: formattedPath,
        lastModified: new Date().toISOString().split('T')[0]
      };
      const updated = [newPage, ...pages];
      savePagesToStorage(updated);
      toast.success(`New page "${formData.title}" created for public folder!`);
      setIsCreateModalOpen(false);
    }

    setFormData({
      title: '',
      filename: '',
      path: '',
      category: 'Public Website',
      status: 'Published',
      metaDescription: '',
      keywords: '',
      heroTitle: '',
      heroSubtitle: '',
      ctaText: 'Learn More',
      ctaLink: '#',
      htmlContent: ''
    });
  };

  const handleToggleStatus = (id) => {
    const updated = pages.map((p) =>
      p.id === id
        ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' }
        : p
    );
    savePagesToStorage(updated);
    toast.info('Page status updated');
  };

  const handleDeletePage = (id) => {
    if (window.confirm('Are you sure you want to delete this page entry?')) {
      const updated = pages.filter((p) => p.id !== id);
      savePagesToStorage(updated);
      toast.success('Page entry removed');
    }
  };

  const openEditModal = (page) => {
    setEditingPage(page);
    setFormData({ ...page });
  };

  const generatePageHtmlCode = (p) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title}</title>
  <meta name="description" content="${p.metaDescription || ''}">
  <meta name="keywords" content="${p.keywords || ''}">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
  <header class="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 p-4">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">MUJ</div>
        <span class="text-xl font-bold tracking-tight text-white">MUJ Sports Management</span>
      </div>
    </div>
  </header>
  <main class="flex-grow max-w-5xl mx-auto px-4 py-12">
    <div class="text-center py-10">
      <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4">${p.heroTitle || p.title}</h1>
      <p class="text-lg text-slate-300 max-w-2xl mx-auto mb-8">${p.heroSubtitle || p.metaDescription || ''}</p>
      <a href="${p.ctaLink || '#'}" class="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition">${p.ctaText || 'Learn More'}</a>
    </div>
  </main>
  <footer class="bg-slate-950 text-slate-400 py-8 border-t border-slate-800 text-center text-sm">
    <p>&copy; ${new Date().getFullYear()} MUJ Volleyball Club. All rights reserved.</p>
  </footer>
</body>
</html>`;
  };

  const handleDownloadHtml = (p) => {
    const code = generatePageHtmlCode(p);
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = p.filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${p.filename} ready for public/ folder`);
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || page.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'All' || page.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['All', 'Core Pages', 'Public Website', 'Content Pages', 'Media', 'Forms & Portal'];

  return (
    <div className="space-y-6">
      <div className="hero-row flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">PUBLIC DIRECTORY & WEBSITE MANAGEMENT</span>
          <h1 className="text-2xl font-extrabold text-white">Public Folder Pages</h1>
          <p className="muted text-xs">
            Manage, edit SEO headers, add new static HTML pages, and update public routes.
          </p>
        </div>

        <button
          className="primary flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
          onClick={() => {
            setEditingPage(null);
            setFormData({
              title: '',
              filename: '',
              path: '',
              category: 'Public Website',
              status: 'Published',
              metaDescription: '',
              keywords: '',
              heroTitle: '',
              heroSubtitle: '',
              ctaText: 'Learn More',
              ctaLink: '#',
              htmlContent: ''
            });
            setIsCreateModalOpen(true);
          }}
        >
          <Plus size={16} />
          <span>Add New Public Page</span>
        </button>
      </div>

      <div className="card p-4 flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, filename, or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-medium text-slate-300">
            {['All', 'Published', 'Draft'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === s ? 'bg-indigo-600 text-white font-semibold' : 'hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Total Pages: <strong className="text-white">{filteredPages.length}</strong>
        </div>
      </div>

      {loading ? (
        <div className="loading-container py-12 text-center text-slate-400 text-xs">
          Loading pages directory...
        </div>
      ) : (
        <CumulativeGrid pages={filteredPages} onEdit={openEditModal} onPreview={(p) => setPreviewPage(p)} onToggleStatus={handleToggleStatus} onDelete={handleDeletePage} onDownload={handleDownloadHtml} />
      )}

      {(isCreateModalOpen || editingPage) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingPage ? `Edit Page: ${editingPage.title}` : 'Add New Public Folder Page'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure page title, route, SEO tags, and hero banner content</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingPage(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Page Title (&lt;title&gt;)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Volleyball Trials 2025"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Target Filename (in public/)</label>
                  <input
                    type="text"
                    value={formData.filename}
                    onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                    placeholder="e.g. trials.html"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Route Path</label>
                  <input
                    type="text"
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    placeholder="e.g. /trials"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {categories.filter(c => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="font-semibold text-slate-300">Hero Section Main Heading</label>
                <input
                  type="text"
                  value={formData.heroTitle || ''}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="e.g. Join the MUJ Volleyball Championship Team"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Hero Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={formData.heroSubtitle || ''}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  placeholder="Brief introductory summary..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.ctaText || ''}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="e.g. Register Now"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">CTA Link Target</label>
                  <input
                    type="text"
                    value={formData.ctaLink || ''}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="e.g. /join or #register"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="font-semibold text-slate-300">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description snippet..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Published">Published (Live)</option>
                  <option value="Draft">Draft (In Progress)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingPage(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center space-x-1.5"
                >
                  <Check size={16} />
                  <span>{editingPage ? 'Save Changes' : 'Create Page'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-white text-sm">{previewPage.title}</span>
                <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {previewPage.path}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-medium text-slate-300">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                      previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : ''
                    }`}
                  >
                    <Monitor size={14} /> Desktop
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                      previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : ''
                    }`}
                  >
                    <Smartphone size={14} /> Mobile
                  </button>
                </div>
                <button
                  onClick={() => setPreviewPage(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 p-4 flex justify-center overflow-hidden">
              <div className={`bg-white transition-all duration-300 rounded-lg overflow-hidden shadow-2xl ${previewDevice === 'desktop' ? 'w-full h-full' : 'w-[375px] h-full'}`}>
                <iframe
                  title={previewPage.title}
                  srcDoc={generatePageHtmlCode(previewPage)}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CumulativeGrid({ pages, onEdit, onPreview, onToggleStatus, onDelete, onDownload }) {
  if (pages.length === 0) {
    return (
      <div className="card p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-sm font-semibold text-white mb-1">No Public Pages Found</p>
        <p className="text-xs">Create a new page to manage its content, SEO metadata, and static HTML.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {pages.map((page) => (
        <div
          key={page.id}
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-2xl shadow-xl flex flex-col justify-between transition group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-bold">
                {page.path || `/${page.filename}`}
              </span>
              <button
                onClick={() => onToggleStatus(page.id)}
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border transition ${
                  page.status === 'Published'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {page.status}
              </button>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition mb-1">
              {page.title}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {page.heroSubtitle || page.metaDescription || 'Public static page.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-medium">{page.category}</span>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => onPreview(page)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Interactive Live Preview"
              >
                <Eye size={14} />
              </button>

              <button
                onClick={() => onDownload(page)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Download HTML file for /public"
              >
                <Download size={14} />
              </button>

              <button
                onClick={() => onEdit(page)}
                className="p-2 rounded-xl bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white transition font-medium inline-flex items-center gap-1"
                title="Edit metadata & content"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onDelete(page.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 transition"
                title="Delete page entry"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}