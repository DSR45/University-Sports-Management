import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';
import { getYouTubeEmbedUrl } from '../../utils/videoUtils';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await publicService.getVideos();
      setVideos(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading videos...</div>;

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Videos & Highlights</h1>
          <p>Watch the best moments from our recent matches.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {videos.length === 0 ? (
            <div className="empty-state">
              <h3>No Videos Available</h3>
              <p>Check back later for match highlights and training videos.</p>
            </div>
          ) : (
            <div className="video-grid">
              {videos.map((video) => {
                const embedUrl = getYouTubeEmbedUrl(video.videoUrl);

                return (
                  <div key={video.id} className="video-card card">
                    <div className="video-embed">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      ) : (
                        <div style={{ display: 'grid', placeItems: 'center', height: '100%', background: '#0f172a', color: '#94a3b8', fontSize: '12px' }}>
                          Invalid Video Link
                        </div>
                      )}
                    </div>
                    <div className="video-info">
                      <span className="category">{video.category}</span>
                      <h3>{video.title}</h3>
                      {video.date && <span>{new Date(video.date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}