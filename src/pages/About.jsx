import React from 'react';
import '../styles/style.css';

export default function About() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! (This is a demo form)");
  };

  return (
    <div className="container">
      <section id="about-us" className="content-section">
        <h2>About Finance Tracker</h2>
        
        <div className="about-content">
          <p>
            The Finance Tracker is a simple, fast, and secure application designed to help the Principie Business Group team and partners effectively manage their money. 
            Now powered by <strong>React and Firebase</strong>, your data is synced securely to the cloud, ensuring it's available whenever you need it.
          </p>

          <h3 style={{marginTop: '30px', color: 'var(--color-primary)'}}>Mission</h3>
          <p>
            Our mission is to empower individuals to take control of their finances by providing a straightforward tool for tracking expenses and staying within a set monthly budget cap. It helps visualize spending habits to make better financial decisions.
          </p>

          <h3 style={{marginTop: '30px', color: 'var(--color-primary)'}}>Key Features</h3>
          <ul style={{marginLeft: '20px', lineHeight: '1.8'}}>
            <li><strong>Cloud Storage:</strong> All transactions and settings are saved securely online via Firebase.</li>
            <li><strong>Live Dashboard:</strong> Instant summary of total spent, budget remaining, and top expense category.</li>
            <li><strong>Powerful Search:</strong> Use advanced Regular Expressions (Regex) to quickly filter transactions.</li>
            <li><strong>Custom Currencies:</strong> Support for multiple base currencies including <strong>RWF, USD, and EUR</strong>.</li>
          </ul>

          <h3 style={{marginTop: '30px', color: 'var(--color-primary)'}}>Meet the Developer</h3>
          <p>
            This application was developed by <strong>Principie Cyubahiro</strong> as a project to demonstrate proficiency in modern web development technologies. Principie is a passionate software engineer focused on building practical solutions.
          </p>
          <p style={{marginTop: '10px'}}>You can connect with Principie here:</p>
          <p>
            LinkedIn: <a href="https://linkedin.com/in/principie" target="_blank" rel="noopener noreferrer" style={{color: 'var(--color-accent)', fontWeight: 'bold'}}>View Profile</a>
          </p>
          <p>
            GitHub: <a href="https://www.github.com/principiecyupe" target="_blank" rel="noopener noreferrer" style={{color: 'var(--color-accent)', fontWeight: 'bold'}}>View Code</a>
          </p>

          {/* CONTACT FORM SECTION */}
          <div className="contact-form-section" style={{marginTop: '40px', background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #eee'}}>
            <h4 style={{marginBottom: '20px', color: 'var(--color-dark)'}}>Have a Question? Contact Me</h4>
            
            <form onSubmit={handleSubmit} className="contact-form" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" required placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label>Your Email</label>
                <input type="email" required placeholder="Enter your email" />
              </div>
              
              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label>Your Message</label>
                <textarea rows="5" required placeholder="How can we help you?" style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}}></textarea>
              </div>

              <div style={{gridColumn: '1 / -1'}}>
                <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Send Email</button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}