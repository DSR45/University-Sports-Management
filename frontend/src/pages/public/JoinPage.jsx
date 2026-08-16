import { Link } from 'react-router-dom';

export default function JoinPage() {
  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Want to be part of MUJ Volleyball?</h1>
          <p>Register through the existing MUJ Volleyball login and registration system.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card">
            <p>
              If you are interested in representing Manipal University Jaipur on the court,
              use the existing player registration flow to join the team.
            </p>
            <Link to="/register" className="btn-primary">JOIN THE TEAM</Link>
          </div>
        </div>
      </section>
    </div>
  );
}