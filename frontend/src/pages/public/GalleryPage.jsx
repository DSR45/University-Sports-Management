import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await publicService.getGallery();

        setGallery(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load gallery:', err);
        setError('Unable to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        Loading gallery...
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-page">
        <section className="section">
          <div className="container">
            <div className="error-state">
              {error}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Gallery</h1>
          <p>Moments captured on and off the court.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {gallery.length === 0 ? (
            <div className="empty-state">
              <h3>No gallery images yet</h3>
              <p>Check back soon for more moments from MUJ Volleyball.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {gallery.map((item) => (
                <article key={item.id} className="gallery-item card">
                  <div className="gallery-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title || 'MUJ Volleyball'}
                        loading="lazy"
                      />
                    ) : (
                      <div className="gallery-image-placeholder">
                        <span>MUJ Volleyball</span>
                      </div>
                    )}
                  </div>

                  <div className="gallery-caption">
                    <h4>{item.title}</h4>

                    <div className="gallery-meta">
                      {item.category && (
                        <span>{item.category}</span>
                      )}

                      {item.date && (
                        <span>
                          {new Date(item.date).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}