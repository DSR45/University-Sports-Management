import { useState, useEffect } from 'react';
import { Megaphone, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { announcementService } from '../../services/announcementService';

export default function Announcements() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementService.getAnnouncements({
        page,
        size: 10
      });
      setAnnouncements(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isNew = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  if (loading && announcements.length === 0) {
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
          <span className="eyebrow">UPDATES & NOTIFICATIONS</span>
          <h1>Announcements</h1>
          <p className="muted">
            Stay updated with the latest news and information about trials and team activities.
          </p>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Megaphone size={32} />
          </div>
          <h3>No Announcements Yet</h3>
          <p>
            There are no announcements at the moment. Check back later for updates 
            about trials, practice sessions, and team information.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="announcement-list">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="announcement">
                <div className="announcement-icon">
                  <Megaphone size={18} />
                </div>

                <div>
                  <div className="announcement-top">
                    <span>{formatDate(announcement.createdAt)}</span>
                    {isNew(announcement.createdAt) && (
                      <span className="pill">NEW</span>
                    )}
                  </div>

                  <h3>{announcement.title}</h3>
                  <p style={{ 
                    color: '#747f8f',
                    fontSize: '11px',
                    lineHeight: '1.6',
                    marginTop: '6px'
                  }}>
                    {announcement.message}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '10px',
                    fontSize: '9px',
                    color: '#9aa3b1'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} />
                      <span>{announcement.createdByName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      <span>
                        {new Date(announcement.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  className={page === idx ? 'active' : ''}
                  disabled={loading}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1 || loading}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}