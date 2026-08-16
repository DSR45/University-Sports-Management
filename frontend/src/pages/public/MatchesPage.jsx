import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await publicService.getMatches();
        setMatches(data);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <div className="loading-state">Loading matches...</div>;

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Matches</h1>
          <p>Past results and match history.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="matches-list">
            {matches.map((match) => (
              <div key={match.id} className={`match-card card ${match.status}`}>
                <div className="match-header">
                  <span className="competition">{match.competition}</span>
                  <span className={`status-badge ${match.status}`}>{match.status.toUpperCase()}</span>
                </div>
                <div className="match-teams">
                  <div className="team">
                    <span className="team-name">MUJ</span>
                  </div>
                  <div className="score-area">
                    {match.status === 'completed' ? (
                      <div className="match-result">
                        <span className="score">{match.result}</span>
                        <small className="sets">{match.sets}</small>
                      </div>
                    ) : (
                      <div className="match-time">
                        <span>{match.time}</span>
                      </div>
                    )}
                  </div>
                  <div className="team">
                    <span className="team-name">{match.opponent}</span>
                  </div>
                </div>
                <div className="match-footer">
                  <span>{new Date(match.date).toLocaleDateString()}</span>
                  <span>{match.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}