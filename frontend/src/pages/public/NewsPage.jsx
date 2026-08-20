import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';
import mujHero from '../../assets/muj_hero.png';
import bg1 from '../../assets/bg1.png';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await publicService.getNews();
        setNews(data);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="loading-state">Loading news...</div>;

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>News</h1>
          <p>Stories, updates, and announcements from MUJ Volleyball.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="news-grid">
            {news.map((item, index) => {
              const imageUrl = item.coverImage || item.image || (index % 2 === 0 ? mujHero : bg1);
              return (
                <article key={item.id} className="news-card card" style={{ overflow: 'hidden', padding: 0 }}>
                  <div className="news-image-wrapper" style={{ width: '100%', height: '200px', overflow: 'hidden', background: '#0f172a' }}>
                    <img
                      src={imageUrl}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = mujHero;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    />
                  </div>
                  <div className="news-content" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="date" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-orange)', textTransform: 'uppercase' }}>
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Update'}
                      </span>
                      {item.author && (
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                          By {item.author}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.excerpt}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}