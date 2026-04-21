export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Samadhan Setu</h3>
            <p>Empowering citizens to report civic issues and work with authorities for quick resolution.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/citizen">Dashboard</a></li>
              <li><a href="/viewmap">View Map</a></li>
              <li><a href="/donation">Donations</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Emergency</h4>
            <ul>
              <li>Police: 100</li>
              <li>Fire: 101</li>
              <li>Ambulance: 102</li>
              <li>Emergency: 112</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>help@samadhan.gov</li>
              <li>1800-XXX-XXXX</li>
              <li>Bhopal Municipal Corp.</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Samadhan Setu. All rights reserved. Made with ❤️ for Bhopal</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--dark-navy);
          color: white;
          padding: 48px 0 24px;
          margin-top: auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 32px;
        }
        .footer-section h3 {
          font-size: 24px;
          margin-bottom: 16px;
          color: var(--primary-blue);
        }
        .footer-section h4 {
          font-size: 16px;
          margin-bottom: 16px;
          color: var(--secondary-green);
        }
        .footer-section p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }
        .footer-section ul {
          list-style: none;
        }
        .footer-section ul li {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.7);
        }
        .footer-section a:hover {
          color: white;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 24px;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}