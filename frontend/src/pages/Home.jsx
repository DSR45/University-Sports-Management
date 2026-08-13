import { useMemo, useState } from 'react';
import playerImage from '../assets/player.png';

const teamPlayers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    jerseyNumber: 12,
    position: 'SETTER',
    secondaryPosition: 'OPPOSITE',
    year: '2nd Year',
    designation: 'Captain',
    bio: 'University Volleyball Team 2026–27 captain leading the squad with calm decision-making, smart setting, and strong match control.',
    initials: 'RS',
    photo: playerImage
  },
  {
    id: 2,
    name: 'Aman Singh',
    jerseyNumber: 7,
    position: 'OUTSIDE_HITTER',
    secondaryPosition: 'OPPOSITE',
    year: '3rd Year',
    designation: 'Vice Captain',
    bio: 'Dynamic left-side attacker known for powerful spikes, quick reads, and high energy during critical rallies.',
    initials: 'AS',
    photo: playerImage
  },
  {
    id: 3,
    name: 'Karan Verma',
    jerseyNumber: 14,
    position: 'SETTER',
    secondaryPosition: 'LIBERO',
    year: '2nd Year',
    designation: 'Main Team Player',
    bio: 'Reliable setter with quick court awareness and strong consistency in high-pressure moments.',
    initials: 'KV',
    photo: playerImage
  },
  {
    id: 4,
    name: 'Vikram Mehta',
    jerseyNumber: 9,
    position: 'OUTSIDE_HITTER',
    secondaryPosition: 'LIBERO',
    year: '3rd Year',
    designation: 'Main Team Player',
    bio: 'Explosive outside hitter focused on aggressive attacks and strong backcourt defense.',
    initials: 'VM',
    photo: playerImage
  },
  {
    id: 5,
    name: 'Ishaan Khanna',
    jerseyNumber: 18,
    position: 'MIDDLE_BLOCKER',
    secondaryPosition: 'OPPOSITE',
    year: '2nd Year',
    designation: 'Main Team Player',
    bio: 'Quick middle blocker with excellent timing and a strong presence at the net.',
    initials: 'IK',
    photo: playerImage
  },
  {
    id: 6,
    name: 'Rohit Nair',
    jerseyNumber: 5,
    position: 'MIDDLE_BLOCKER',
    secondaryPosition: 'SETTER',
    year: '1st Year',
    designation: 'Main Team Player',
    bio: 'Strong blocker who brings vertical reach and discipline to the front row.',
    initials: 'RN',
    photo: playerImage
  },
  {
    id: 7,
    name: 'Dev Sharma',
    jerseyNumber: 11,
    position: 'OPPOSITE',
    secondaryPosition: 'OUTSIDE_HITTER',
    year: '3rd Year',
    designation: 'Main Team Player',
    bio: 'Versatile opposite hitter with strong attacking power and effective transition play.',
    initials: 'DS',
    photo: playerImage
  },
  {
    id: 8,
    name: 'Aditya Rao',
    jerseyNumber: 2,
    position: 'LIBERO',
    secondaryPosition: 'OUTSIDE_HITTER',
    year: '2nd Year',
    designation: 'Main Team Player',
    bio: 'Pass-first libero with quick reflexes, disciplined digging, and steady court coverage.',
    initials: 'AR',
    photo: playerImage
  },
  {
    id: 9,
    name: 'Tarun Joshi',
    jerseyNumber: 16,
    position: 'OUTSIDE_HITTER',
    secondaryPosition: 'MIDDLE_BLOCKER',
    year: '2nd Year',
    designation: 'Main Team Player',
    bio: 'All-round attacker who adds balance to the offense with smart shot selection and quick recovery.',
    initials: 'TJ',
    photo: playerImage
  },
  {
    id: 10,
    name: 'Nikhil Saini',
    jerseyNumber: 8,
    position: 'MIDDLE_BLOCKER',
    secondaryPosition: 'OUTSIDE_HITTER',
    year: '4th Year',
    designation: 'Main Team Player',
    bio: 'Experienced blocker with leadership on court and strong defensive positioning.',
    initials: 'NS',
    photo: playerImage
  },
  {
    id: 11,
    name: 'Harsh Yadav',
    jerseyNumber: 4,
    position: 'LIBERO',
    secondaryPosition: 'SETTER',
    year: '1st Year',
    designation: 'Main Team Player',
    bio: 'Energetic defensive specialist driving service pressure and efficient backcourt play.',
    initials: 'HY',
    photo: playerImage
  }
];

const positions = [
  'SETTER',
  'OUTSIDE_HITTER',
  'MIDDLE_BLOCKER',
  'OPPOSITE',
  'LIBERO'
];

const formatPosition = (position) =>
  position.replace('_', ' ');

export default function HomePage() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const leaders = useMemo(() => {
    const captain = teamPlayers.find((player) => player.designation === 'Captain');
    const viceCaptain = teamPlayers.find((player) => player.designation === 'Vice Captain');
    return { captain, viceCaptain };
  }, []);

  const groupedPlayers = useMemo(() => {
    return positions.reduce((acc, position) => {
      acc[position] = teamPlayers.filter((player) => player.position === position);
      return acc;
    }, {});
  }, []);

  return (
    <>
      <div className="home-hero card">
        <div className="home-hero-copy">
          <span className="eyebrow">UNIVERSITY VOLLEYBALL</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1>Main Team 2026–27</h1>
            <span className="badge-soon">Feature coming soon</span>
          </div>
          <p className="muted">
            Meet the players representing our university on the court with discipline, energy, and team pride.
          </p>
        </div>
      </div>

      <section className="card">
        <div className="card-header">
          <div>
            <span className="eyebrow">TEAM LEADERS</span>
            <h3>Leadership Group</h3>
          </div>
        </div>

        <div className="leader-grid">
          {leaders.captain && (
            <button
              key={leaders.captain.id}
              type="button"
              className="leader-card standout"
              onClick={() => setSelectedPlayer(leaders.captain)}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.8)), url(${leaders.captain.photo})`
              }}
            >
              <span className="leader-role">CAPTAIN</span>
              <div className="leader-meta">
                <strong>{leaders.captain.name}</strong>
                <span>#{leaders.captain.jerseyNumber}</span>
                <small>{formatPosition(leaders.captain.position)}</small>
              </div>
            </button>
          )}

          {leaders.viceCaptain && (
            <button
              key={leaders.viceCaptain.id}
              type="button"
              className="leader-card standout"
              onClick={() => setSelectedPlayer(leaders.viceCaptain)}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.8)), url(${leaders.viceCaptain.photo})`
              }}
            >
              <span className="leader-role">VICE CAPTAIN</span>
              <div className="leader-meta">
                <strong>{leaders.viceCaptain.name}</strong>
                <span>#{leaders.viceCaptain.jerseyNumber}</span>
                <small>{formatPosition(leaders.viceCaptain.position)}</small>
              </div>
            </button>
          )}
        </div>
      </section>

      <section className="card" style={{ marginTop: '18px' }}>
        <div className="card-header">
          <div>
            <span className="eyebrow">MAIN TEAM</span>
            <h3>Player Roster</h3>
          </div>
        </div>

        <div className="team-sections">
          {positions.map((position) => {
            const players = groupedPlayers[position];
            if (!players.length) return null;

            return (
              <div key={position} className="position-group">
                <h4>{formatPosition(position)}</h4>
                <div className="player-grid">
                  {players.map((player) => (
                    <button
                      key={player.id}
                      type="button"
                      className="player-card"
                      onClick={() => setSelectedPlayer(player)}
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.8)), url(${player.photo})`
                      }}
                    >
                      <div className="player-card-copy">
                        <strong>{player.name}</strong>
                        <span>#{player.jerseyNumber}</span>
                        <small>{formatPosition(player.position)}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Player Details</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedPlayer(null)}
                aria-label="Close player details"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="player-modal-header">
                <div
                  className="player-avatar modal-avatar"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.5)), url(${selectedPlayer.photo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '72px',
                    height: '72px',
                    borderRadius: '14px',
                    color: '#fff'
                  }}
                >
                  {selectedPlayer.initials}
                </div>
                <div>
                  <div className="player-modal-role">{selectedPlayer.designation}</div>
                  <h4>{selectedPlayer.name}</h4>
                  <div className="player-modal-meta">
                    <span>#{selectedPlayer.jerseyNumber}</span>
                    <span>{formatPosition(selectedPlayer.position)}</span>
                  </div>
                </div>
              </div>

              <div className="player-detail-grid">
                <div>
                  <span>Primary Position</span>
                  <strong>{formatPosition(selectedPlayer.position)}</strong>
                </div>
                <div>
                  <span>Secondary Position</span>
                  <strong>{formatPosition(selectedPlayer.secondaryPosition)}</strong>
                </div>
                <div>
                  <span>Year</span>
                  <strong>{selectedPlayer.year}</strong>
                </div>
                <div>
                  <span>Designation</span>
                  <strong>{selectedPlayer.designation}</strong>
                </div>
              </div>

              <div className="player-about">
                <span>About</span>
                <p>{selectedPlayer.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
