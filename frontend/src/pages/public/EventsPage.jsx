import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';
import mujHero from '../../assets/muj_hero.png';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await publicService.getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading events...</div>;

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Events & Trials</h1>
          <p>Join us at our upcoming trials and workshops.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="events-list">
            {events.map((event) => {
              const statusStr = (event.status || 'UPCOMING').toUpperCase();
              return (
                <div key={event.id} className={`event-card card ${statusStr.toLowerCase()}`}>
                  <div className="event-image-placeholder" style={{ overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={event.image || mujHero}
                      alt={event.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '180px', display: 'block' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = mujHero;
                      }}
                    />
                  </div>
                  <div className="event-details">
                    <span className={`status-badge ${statusStr.toLowerCase()}`}>{statusStr}</span>
                    <h3>{event.title}</h3>
                    <p className="event-meta">
                      <span>{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</span>
                      {event.time && <span>{event.time}</span>}
                      <span>{event.venue || event.location || 'MUJ Campus'}</span>
                    </p>
                    <p className="description">{event.description}</p>
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