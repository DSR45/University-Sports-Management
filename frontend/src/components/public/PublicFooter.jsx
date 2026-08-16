import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>MUJ VOLLEYBALL</h4>
          <p>Official volleyball team of Manipal University Jaipur.</p>
        </div>
        <div className="footer-section">
          <h5>Quick Links</h5>
          <Link to="/team">Team</Link>
          <Link to="/matches">Matches</Link>
          <Link to="/news">News</Link>
          <Link to="/join">Join Us</Link>
        </div>
        <div className="footer-section">
          <h5>Contact</h5>
          <p>Manipal University Jaipur</p>
          <p>Jaipur-Ajmer Express Highway</p>
          <p>Dehmi Kalan, Near GVK Toll Plaza</p>
          <p>Jaipur, Rajasthan 303007</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MUJ Volleyball. All rights reserved.</p>
      </div>
    </footer>
  );
}