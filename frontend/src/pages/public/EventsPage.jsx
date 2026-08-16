import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await publicService.getEvents();
      setEvents(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading events...</div>;

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Events</h1>
          <p>Join us at our upcoming trials and workshops.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className={`event-card card ${event.status}`}>
                <div className="event-image-placeholder"></div>
                <div className="event-details">
                  <span className={`status-badge ${event.status}`}>{event.status.toUpperCase()}</span>
                  <h3>{event.title}</h3>
                  <p className="event-meta">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.time}</span>
                    <span>{event.venue}</span>
                  </p>
                  <p className="description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}