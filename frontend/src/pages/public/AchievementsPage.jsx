import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await publicService.getAchievements();
      setAchievements(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading achievements...</div>;

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Achievements</h1>
          <p>Celebrating our legacy of excellence.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="achievements-grid-detailed">
            {achievements.map(ach => (
              <div key={ach.id} className="achievement-detail-card card">
                <div className="achievement-image-placeholder"></div>
                <div className="achievement-content">
                  <span className="year-badge">{ach.year}</span>
                  <h3>{ach.title}</h3>
                  <p className="competition">{ach.competition}</p>
                  <p className="description">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}