import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';

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
          <div className="video-grid">
            {videos.map(video => (
              <div key={video.id} className="video-card card">
                <div className="video-embed">
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="video-info">
                  <span className="category">{video.category}</span>
                  <h3>{video.title}</h3>
                  <span>{new Date(video.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}