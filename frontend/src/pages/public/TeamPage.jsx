import { useEffect, useMemo, useState } from 'react';
import { publicService } from '../../services/publicService';

const POSITION_ORDER = ['SETTER', 'OUTSIDE_HITTER', 'OPPOSITE', 'MIDDLE_BLOCKER', 'LIBERO'];

export default function TeamPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await publicService.getPlayers();
        setPlayers(data);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const groupedPlayers = useMemo(
    () => POSITION_ORDER.reduce((acc, position) => {
      acc[position] = players.filter((player) => player.position === position);
      return acc;
    }, {}),
    [players]
  );

  if (loading) return <div className="loading-state">Loading team...</div>;

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Team</h1>
          <p>Public roster of MUJ Volleyball main team players.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {POSITION_ORDER.map((position) => (
            groupedPlayers[position].length > 0 && (
              <div key={position} className="public-team-group">
                <h2>{position.replace('_', ' ')}</h2>
                <div className="player-grid">
                  {groupedPlayers[position].map((player) => (
                    <div key={player.id} className="player-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.8)), url(${player.photo})` }}>
                      <div className="player-card-copy">
                        <strong>{player.name}</strong>
                        <span>#{player.jerseyNumber}</span>
                        <small>{player.academicYear}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </section>
    </div>
  );
}