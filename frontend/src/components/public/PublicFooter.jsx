import { Link } from 'react-router-dom';
import { Shield, Code, Heart } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>MUJ VOLLEYBALL</h4>
          <p>Official volleyball team platform of Manipal University Jaipur.</p>
          <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} style={{ color: '#f97316' }} />
            <span>Official Sports Management Portal</span>
          </div>
        </div>
        <div className="footer-section">
          <h5>Quick Links</h5>
          <Link to="/team">Team Roster</Link>
          <Link to="/matches">Matches & Scores</Link>
          <Link to="/news">Latest News</Link>
          <Link to="/events">Events & Trials</Link>
          <Link to="/achievements">Achievements</Link>
        </div>
        <div className="footer-section">
          <h5>Contact & Location</h5>
          <p>Manipal University Jaipur</p>
          <p>Jaipur-Ajmer Express Highway</p>
          <p>Dehmi Kalan, Near GVK Toll Plaza</p>
          <p>Jaipur, Rajasthan 303007</p>
        </div>
      </div>
      <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <p>&copy; {new Date().getFullYear()} MUJ Volleyball. All rights reserved.</p>
        <div className="footer-credits" style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
          <span>Designed & Developed by</span>
          <strong style={{ color: '#f97316', fontWeight: '700' }}>DSR & SHOBHIT </strong>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ background: 'rgba(255, 106, 0, 0.12)', color: '#ff6a00', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', border: '1px solid rgba(255, 106, 0, 0.25)', letterSpacing: '0.05em' }}>
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}