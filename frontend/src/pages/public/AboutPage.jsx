import { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';

export default function AboutPage() {
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await publicService.getTeamInfo();
      setTeamInfo(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>About MUJ Volleyball</h1>
          <p>{teamInfo?.philosophy}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>{teamInfo?.history}</p>
              
              <h2>Our Mission</h2>
              <p>{teamInfo?.description}</p>

              <h2>Our Vision</h2>
              <p>{teamInfo?.vision}</p>
            </div>
            <div className="about-values">
              <div className="value-card card">
                <h3>Passion</h3>
                <p>We play with heart and dedication in every match.</p>
              </div>
              <div className="value-card card">
                <h3>Discipline</h3>
                <p>Excellence is a habit formed through consistent hard work.</p>
              </div>
              <div className="value-card card">
                <h3>Teamwork</h3>
                <p>We win together and learn together as one unit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}