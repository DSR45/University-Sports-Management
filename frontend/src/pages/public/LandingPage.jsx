import { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, ShieldCheck, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState({
    players: [],
    news: [],
    result: null,
    team: null,
    achievements: [],
    gallery: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [players, news, result, team, achievements, gallery] = await Promise.all([
          publicService.getPlayers(),
          publicService.getNews(),
          publicService.getLatestResult(),
          publicService.getTeamInfo(),
          publicService.getAchievements(),
          publicService.getGallery()
        ]);

        setData({
          players: players.slice(0, 4),
          news: news.slice(0, 3),
          result,
          team,
          achievements: achievements.slice(0, 2),
          gallery: gallery.slice(0, 4)
        });
      } catch (error) {
        console.error('Error fetching landing page data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading MUJ Volleyball...</div>;

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="container">
          <span className="eyebrow">MANIPAL UNIVERSITY JAIPUR</span>
          <h1>MUJ VOLLEYBALL</h1>
          <p className="philosophy">PASSION • DISCIPLINE • TEAMWORK</p>
          <p className="hero-desc">{data.team?.description}</p>
        </div>
      </section>

            {data.result && (() => {
        let ourScore = data.result.ourScore;
        let oppScore = data.result.opponentScore;
        if ((ourScore === undefined || oppScore === undefined) && data.result.result && String(data.result.result).includes('-')) {
          const parts = String(data.result.result).split('-');
          ourScore = parseInt(parts[0], 10) || 0;
          oppScore = parseInt(parts[1], 10) || 0;
        }

        return (
          <section className="result-section">
            <div className="container">
              <div className="section-header">
                <span className="eyebrow">LATEST RESULT</span>
              </div>
              <div className="result-card card">
                <div className="result-main">
                  <div className="team-score">
                    <span className="team-name">MUJ</span>
                    <span className="score">{ourScore ?? 0}</span>
                  </div>
                  <div className="divider">—</div>
                  <div className="team-score">
                    <span className="score">{oppScore ?? 0}</span>
                    <span className="team-name">{data.result.opponent}</span>
                  </div>
                </div>
                <div className="result-meta">
                  <span>{data.result.tournamentName || data.result.competition || 'Inter-University Tournament'}</span>
                  <span>{data.result.date ? new Date(data.result.date).toLocaleDateString() : ''}</span>
                </div>
                <Link to="/matches" className="section-action-link">
                  <span>VIEW ALL MATCHES</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      <section className="preview-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">TEAM PREVIEW</span>
              <h2>Our Athletes</h2>
            </div>
            <Link to="/team" className="section-action-link">
              <span>VIEW FULL TEAM</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="player-grid">
            {data.players.map((player) => (
              <div
                key={player.id}
                className="player-card"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.8)), url(${player.photo})` }}
              >
                <div className="player-card-copy">
                  <strong>{player.name}</strong>
                  <span>#{player.jerseyNumber}</span>
                  <small>{player.position.replace('_', ' ')}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="preview-section bg-alt">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">LATEST NEWS</span>
              <h2>Inside the Court</h2>
            </div>
            <Link to="/news" className="section-action-link">
              <span>VIEW ALL NEWS</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="news-grid">
            {data.news.map((item) => (
              <div key={item.id} className="news-card card">
                <div className="news-content">
                  <span className="date">{new Date(item.publishedAt).toLocaleDateString()}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="preview-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">EXCELLENCE</span>
              <h2>Achievements</h2>
            </div>
            <Link to="/achievements" className="section-action-link">
              <span>VIEW ALL</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="achievements-grid">
            {data.achievements.map((ach) => (
              <div key={ach.id} className="achievement-card card">
                <span className="year">{ach.year}</span>
                <h3>{ach.title}</h3>
                <p>{ach.competition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-identity-section bg-dark">
        <div className="container">
          <div className="identity-content">
            <div className="identity-label">
              <ShieldCheck size={18} />
              <span>ABOUT MUJ VOLLEYBALL</span>
            </div>
            <span className="eyebrow">TEAM IDENTITY</span>
            <h2>Excellence, Discipline, Resilience</h2>
            <p>{data.team?.vision}</p>
            <Link to="/about" className="section-action-link light-link">
              <span>ABOUT MUJ VOLLEYBALL</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

            {!isAuthenticated && (
        <section className="final-cta">
          <div className="container">
            <div className="cta-panel card">
              <div className="cta-icon">
                <Trophy size={20} />
              </div>
              <h2>READY TO REPRESENT MUJ?</h2>
              <p>Be part of the MUJ Volleyball journey.</p>
              <button onClick={() => navigate('/join')} className="cta-button">JOIN THE TEAM</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
