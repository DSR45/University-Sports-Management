import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Megaphone, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { announcementService } from '../../services/announcementService';

export default function AdminAnnouncements() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
      title: '',
      content: ''
    });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementService.getAnnouncements({ page: 0, size: 100 });
      setAnnouncements(res.data.content || []);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingId(announcement.id);
            setFormData({
        title: announcement.title || '',
        content: announcement.content || announcement.message || ''
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', content: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', content: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await announcementService.updateAnnouncement(editingId, formData);
        toast.success('Announcement updated successfully!');
      } else {
        await announcementService.createAnnouncement(formData);
        toast.success('Announcement created successfully!');
      }
      handleCloseModal();
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to save announcement:', error);
      toast.error('Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await announcementService.deleteAnnouncement(id);
      toast.success('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading announcements...</span>
      </div>
    );
  }

  return (
    <>
      <div className="hero-row">
        <div>
          <span className="eyebrow">COMMUNICATION</span>
          <h1>Announcements</h1>
          <p className="muted">
            Manage announcements and updates for all players.
          </p>
        </div>

        <button className="primary" onClick={() => handleOpenModal()}>
          <Plus size={16} />
          New Announcement
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Megaphone size={32} />
          </div>
          <h3>No Announcements Yet</h3>
          <p>
            Create your first announcement to communicate with all registered players.
          </p>
          <button className="primary" onClick={() => handleOpenModal()} style={{ marginTop: '16px' }}>
            <Plus size={16} />
            Create Announcement
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="admin-announcements">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="admin-announcement">
                <div className="announcement-icon">
                  <Megaphone size={18} />
                </div>

                <div className="announcement-copy">
                  <strong>{announcement.title}</strong>
                  <span>
                    {new Date(announcement.createdAt).toLocaleDateString()} by {announcement.createdByName}
                  </span>
                  <p>{announcement.content || announcement.message}</p>
                </div>

                <div className="row-actions">
                  <button onClick={() => handleOpenModal(announcement)}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(announcement.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <label className="field">
                  <span>Title</span>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Trial Schedule Update"
                    required
                    maxLength={200}
                  />
                </label>

                <label className="field" style={{ marginTop: '16px' }}>
                  <span>Message</span>
                                    <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter the announcement details here..."
                    required
                    rows="6"
                  />
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
