export default function ContactPage() {
  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with the MUJ Volleyball team.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-card card">
                <h3>University Address</h3>
                <p>Manipal University Jaipur</p>
                <p>Jaipur-Ajmer Express Highway</p>
                <p>Dehmi Kalan, Near GVK Toll Plaza</p>
                <p>Jaipur, Rajasthan 303007</p>
              </div>
              
              <div className="contact-card card">
                <h3>Enquiries</h3>
                <p><strong>Team & Trials:</strong> volleyball@muj.manipal.edu</p>
                <p><strong>Collaborations:</strong> sports.office@muj.manipal.edu</p>
                <p><strong>Media:</strong> media@muj.manipal.edu</p>
              </div>
            </div>

            <div className="contact-form-placeholder card">
              <h3>Send us a message</h3>
              <p>Please use the official university channels for formal communication.</p>
              <div className="form-group">
                <label>Name</label>
                <input type="text" disabled placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" disabled placeholder="Your email" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea disabled placeholder="Your message"></textarea>
              </div>
              <button className="btn-primary" disabled>SEND MESSAGE (Coming Soon)</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}