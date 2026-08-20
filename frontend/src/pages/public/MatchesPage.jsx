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
            {matches.map((match) => {
              const statusStr = (match.status || 'UPCOMING').toUpperCase();
              const isCompleted =
                statusStr === 'COMPLETED' ||
                match.ourScore !== undefined ||
                (match.result && String(match.result).includes('-'));

              let ourScore = match.ourScore;
              let oppScore = match.opponentScore;
              if ((ourScore === undefined || oppScore === undefined) && match.result && String(match.result).includes('-')) {
                const parts = String(match.result).split('-');
                ourScore = parseInt(parts[0], 10) || 0;
                oppScore = parseInt(parts[1], 10) || 0;
              }
              const scoreText = (ourScore !== undefined && oppScore !== undefined)
                ? `${ourScore} - ${oppScore}`
                : (match.result || '0 - 0');

              return (
                <div key={match.id} className={`match-card card ${statusStr.toLowerCase()}`}>
                  <div className="match-header">
                    <span className="competition">{match.tournamentName || match.competition || 'Inter-University Championship'}</span>
                    <span className={`status-badge ${statusStr.toLowerCase()}`}>
                      {(match.outcome || statusStr).toUpperCase()}
                    </span>
                  </div>
                  <div className="match-teams">
                    <div className="team">
                      <span className="team-name">MUJ</span>
                    </div>
                    <div className="score-area">
                      {isCompleted ? (
                        <div className="match-result">
                          <span className="score">{scoreText}</span>
                          {(match.sets || match.highlights) && (
                            <small className="sets">{match.sets || match.highlights}</small>
                          )}
                        </div>
                      ) : (
                        <div className="match-time">
                          <span>{match.time || '16:00'}</span>
                        </div>
                      )}
                    </div>
                    <div className="team">
                      <span className="team-name">{match.opponent || 'Opponent'}</span>
                    </div>
                  </div>
                  <div className="match-footer">
                    <span>{match.date ? new Date(match.date).toLocaleDateString() : 'TBA'}</span>
                    <span>{match.venue || match.location || 'MUJ Sports Complex'}</span>
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