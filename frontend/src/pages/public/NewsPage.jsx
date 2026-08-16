import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';

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
            {news.map((item) => (
              <article key={item.id} className="news-card card">
                <div className="news-content">
                  <span className="date">{new Date(item.publishedAt).toLocaleDateString()}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}