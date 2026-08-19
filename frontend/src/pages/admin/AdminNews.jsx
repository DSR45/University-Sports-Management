import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Search, Edit3, Trash2, Calendar, User, X, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { mockNews } from '../../data/mock/news';

const toLocalDateTime = (dateValue) => {
  if (!dateValue) return new Date().toISOString().slice(0, 19);
  if (dateValue.includes('T')) return dateValue.slice(0, 19);
  return `${dateValue}T00:00:00`;
};

export default function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'Sports Desk',
    publishedAt: new Date().toISOString().substring(0, 10)
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await adminService.getNews();
      setNewsList(res.data && res.data.length > 0 ? res.data : mockNews);
    } catch (err) {
      const stored = localStorage.getItem('muj_admin_news');
      if (stored) {
        setNewsList(JSON.parse(stored));
      } else {
        setNewsList(mockNews);
        localStorage.setItem('muj_admin_news', JSON.stringify(mockNews));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveNewsToStorage = (updated) => {
    setNewsList(updated);
    localStorage.setItem('muj_admin_news', JSON.stringify(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Title, excerpt, and content are required');
      return;
    }

        try {
          const payload = {
            ...formData,
            publishedAt: toLocalDateTime(formData.publishedAt)
          };

          if (editingArticle) {
            await adminService.updateNews(editingArticle.id, payload);
            const updated = newsList.map((item) =>
              item.id === editingArticle.id ? { ...item, ...payload } : item
            );
            saveNewsToStorage(updated);
            toast.success('News article updated!');
          } else {
            const res = await adminService.createNews(payload);
            const created = res.data || {
              id: `news-${Date.now()}`,
              ...payload
            };
            const updated = [created, ...newsList];
            saveNewsToStorage(updated);
            toast.success('News article published!');
          }
          setIsModalOpen(false);
          setEditingArticle(null);
          setFormData({
            title: '',
            excerpt: '',
            content: '',
            coverImage: '',
            author: 'Sports Desk',
            publishedAt: new Date().toISOString().substring(0, 10)
          });
        } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Failed to save news article';
          toast.error(msg);
        }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await adminService.deleteNews(id).catch(() => {});
        const updated = newsList.filter((n) => n.id !== id);
        saveNewsToStorage(updated);
        toast.success('Article deleted');
      } catch (err) {
        toast.error('Failed to delete article');
      }
    }
  };

  const openEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      coverImage: article.coverImage || '',
      author: article.author || 'Sports Desk',
      publishedAt: article.publishedAt ? article.publishedAt.substring(0, 10) : ''
    });
    setIsModalOpen(true);
  };

  const filteredNews = newsList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="hero-row flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">NEWS & MEDIA MANAGEMENT</span>
          <h1 className="text-2xl font-extrabold text-white">News Articles</h1>
          <p className="muted text-xs">
            Create and edit news stories displayed on <code className="text-indigo-400">/news</code>.
          </p>
        </div>

        <button
          className="primary flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
          onClick={() => {
            setEditingArticle(null);
            setFormData({
              title: '',
              excerpt: '',
              content: '',
              coverImage: '',
              author: 'Sports Desk',
              publishedAt: new Date().toISOString().substring(0, 10)
            });
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} />
          <span>Publish New Article</span>
        </button>
      </div>

      <div className="card p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search news title or excerpt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Articles: <strong className="text-white">{filteredNews.length}</strong>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading news...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNews.map((article) => (
            <div
              key={article.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
                  <span className="flex items-center gap-1 font-mono"><Calendar size={12} /> {article.publishedAt ? article.publishedAt.substring(0, 10) : ''}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{article.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{article.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEdit(article)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-semibold transition flex items-center gap-1"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
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
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingArticle ? 'Edit Article' : 'Create News Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-200">
              <div>
                <label className="font-semibold block mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Excerpt *</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Full Article Content *</label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
