import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';
import mujHero from '../../assets/muj_hero.png';
import bg1 from '../../assets/bg1.png';
import { Trophy } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await publicService.getAchievements();
        setAchievements(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading achievements...</div>;

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Achievements</h1>
          <p>Celebrating our legacy of championship titles, medals, and excellence.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="achievements-grid-detailed">
            {achievements.map((ach, index) => {
              const imageUrl = ach.image || ach.photo || ach.coverImage || (index % 2 === 0 ? bg1 : mujHero);
              return (
                <div key={ach.id} className="achievement-detail-card card" style={{ overflow: 'hidden', padding: 0 }}>
                  <div className="achievement-image-wrapper" style={{ width: '100%', height: '200px', overflow: 'hidden', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', position: 'relative' }}>
                    <img
                      src={imageUrl}
                      alt={ach.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = bg1;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '14px', right: '14px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 106, 0, 0.9)', color: '#ffffff', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <Trophy size={18} />
                    </div>
                  </div>
                  <div className="achievement-content" style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span className="year-badge" style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(255, 106, 0, 0.12)', color: 'var(--primary-orange)', padding: '4px 10px', borderRadius: '999px', letterSpacing: '0.05em' }}>
                        {ach.year}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '8px 0 4px', color: 'var(--text-primary)' }}>{ach.title}</h3>
                    <p className="competition" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '10px' }}>{ach.competition}</p>
                    <p className="description" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{ach.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}