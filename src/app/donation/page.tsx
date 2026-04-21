'use client';

import { useState } from 'react';
import { useTheme } from '../providers';
import Link from 'next/link';

const causes = [
  { id: 'flood', name: 'Flood Relief', description: 'Help victims of recent floods', goal: 500000, raised: 325000, icon: '🌊', color: '#8b5cf6' },
  { id: 'wildlife', name: 'Wildlife Rescue', description: 'Support forest & animal rescue', goal: 300000, raised: 180000, icon: '🦌', color: '#06b6d4' },
  { id: 'clean', name: 'City Cleanup', description: 'Keep our city clean & green', goal: 200000, raised: 145000, icon: '🌿', color: '#f59e0b' },
];

export default function DonationPage() {
  const { isDark, toggleTheme } = useTheme();
  const [selectedCause, setSelectedCause] = useState(causes[0].id);
  const [amount, setAmount] = useState(500);
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        donor_name: donorName,
        message,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setDonationSuccess(true);
      setTimeout(() => {
        setDonorName('');
        setMessage('');
        setAmount(500);
        setDonationSuccess(false);
      }, 3000);
    }
    setLoading(false);
  };

  const amounts = [100, 250, 500, 1000, 2000];

  return (
    <div className="donation-page">
      <header className="donation-header">
        <div className="container header-inner">
          <Link href="/" className="logo-box">
            <img src="/logo.png" alt="Samadhan Setu" className="logo-img" />
            <span className="logo-text">Samadhan Setu</span>
          </Link>
          <nav className="header-nav">
            <Link href="/home">Home</Link>
            <Link href="/viewmap">Map</Link>
            <Link href="/donation" className="active">Donate</Link>
            <Link href="/ecovoice">EcoVoice</Link>
          </nav>
          <button onClick={toggleTheme} className="theme-toggle">{isDark ? '☀️' : '🌙'}</button>
        </div>
      </header>

      {donationSuccess && (
        <div className="success-toast">
          <span>🎉</span> Thank you! Your donation helps make a difference!
        </div>
      )}

      <section className="donation-hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">Support Our Mission</span>
            <h1>Make a Real Difference</h1>
            <p>Your generosity helps build a better community for everyone</p>
            <div className="hero-stats">
              <div className="h-stat">
                <span className="h-num">₹50L+</span>
                <span className="h-label">Raised</span>
              </div>
              <div className="h-stat">
                <span className="h-num">500+</span>
                <span className="h-label">Donors</span>
              </div>
              <div className="h-stat">
                <span className="h-num">10K+</span>
                <span className="h-label">Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#ffffff" d="M0,64 C288,120 576,0 864,64 C1152,128 1440,32 1440,32 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <section className="causes-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose a Cause</h2>
            <p className="section-desc">Select where you want to make an impact</p>
          </div>
          
          <div className="causes-grid">
            {causes.map((cause) => (
              <div 
                key={cause.id} 
                className={`cause-card ${selectedCause === cause.id ? 'selected' : ''}`}
                onClick={() => setSelectedCause(cause.id)}
                style={{ '--accent': cause.color } as any}
              >
                <div className="cause-header">
                  <span className="cause-icon">{cause.icon}</span>
                  <div className="cause-badge">Active</div>
                </div>
                <h3>{cause.name}</h3>
                <p>{cause.description}</p>
                <div className="cause-progress">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(cause.raised / cause.goal) * 100}%`, background: cause.color }}></div>
                  </div>
                  <div className="progress-info">
                    <span>₹{cause.raised.toLocaleString()}</span>
                    <span>of ₹{cause.goal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="donation-container">
            <div className="donation-card">
              <div className="card-header">
                <h3>💝 Your Donation</h3>
                <p>Support {causes.find(c => c.id === selectedCause)?.name}</p>
              </div>
              
              <div className="amount-grid">
                {amounts.map((a) => (
                  <button 
                    key={a} 
                    className={`amount-btn ${amount === a ? 'active' : ''}`}
                    onClick={() => setAmount(a)}
                  >
                    ₹{a}
                  </button>
                ))}
              </div>

              <div className="custom-amount">
                <label>Custom Amount</label>
                <div className="amount-input">
                  <span className="currency">₹</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="100"
                    max="100000"
                  />
                </div>
              </div>

              <form onSubmit={handleDonate}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      value={donorName} 
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Enter your name"
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Message (Optional)</label>
                  <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Leave a message of support..."
                    rows={3}
                  />
                </div>
                <button type="submit" className="donate-btn" disabled={loading}>
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>✨</span> Donate ₹{amount}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="container">
          <h2 className="section-title white">Together We Create Impact</h2>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-circle">
                <span className="impact-icon">🏠</span>
              </div>
              <span className="impact-num">500+</span>
              <span className="impact-label">Families Helped</span>
            </div>
            <div className="impact-card">
              <div className="impact-circle">
                <span className="impact-icon">🌳</span>
              </div>
              <span className="impact-num">10K+</span>
              <span className="impact-label">Trees Planted</span>
            </div>
            <div className="impact-card">
              <div className="impact-circle">
                <span className="impact-icon">💪</span>
              </div>
              <span className="impact-num">₹50L+</span>
              <span className="impact-label">Funds Raised</span>
            </div>
            <div className="impact-card">
              <div className="impact-circle">
                <span className="impact-icon">🤝</span>
              </div>
              <span className="impact-num">1000+</span>
              <span className="impact-label">Volunteers</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="donation-footer">
        <div className="container">
          <p>© 2026 Samadhan Setu. All Rights Reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .donation-page {
          min-height: 100vh;
          background: #fafbfc;
        }
        
        .donation-header {
          background: linear-gradient(135deg, #1e3a5f, #3b82f6);
          padding: 14px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-box {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .logo-img {
          height: 46px;
          border-radius: 10px;
        }
        .logo-text {
          font-size: 22px;
          font-weight: 800;
          color: white;
        }
        .header-nav {
          display: flex;
          gap: 16px;
        }
        .header-nav a {
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          padding: 12px 20px;
          border: 2px solid rgba(255,255,255,0.5);
          border-radius: 10px;
          transition: all 0.3s;
        }
        .header-nav a:hover, .header-nav a.active {
          background: rgba(255,255,255,0.15);
          border-color: white;
          color: white;
        }
        .theme-toggle {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(255,255,255,0.15);
          border: none;
          font-size: 18px;
          cursor: pointer;
        }

        .success-toast {
          position: fixed;
          top: 90px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          padding: 18px 36px;
          border-radius: 16px;
          font-weight: 700;
          z-index: 200;
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
          animation: popIn 0.5s ease;
        }
        @keyframes popIn {
          from { transform: translateX(-50%) scale(0.8); opacity: 0; }
          to { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        .donation-hero {
          position: relative;
          padding: 100px 0;
          text-align: center;
          color: white;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600') center/cover no-repeat;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.92), rgba(99, 102, 241, 0.88));
        }
        .hero-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
        }
        .shape-1 { width: 300px; height: 300px; top: -100px; right: -50px; }
        .shape-2 { width: 200px; height: 200px; bottom: -50px; left: -50px; }
        .shape-3 { width: 150px; height: 150px; top: 50%; left: 20%; }
        
        .hero-content {
          position: relative;
          z-index: 1;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 10px 24px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .donation-hero h1 {
          font-size: 56px;
          margin: 0 0 16px;
          font-weight: 800;
        }
        .donation-hero p {
          font-size: 22px;
          opacity: 0.95;
          margin: 0 0 40px;
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 50px;
        }
        .h-stat {
          text-align: center;
        }
        .h-num {
          display: block;
          font-size: 40px;
          font-weight: 800;
        }
        .h-label {
          font-size: 15px;
          opacity: 0.85;
        }

        .wave-divider {
          height: 80px;
          margin-top: -1px;
        }
        .wave-divider svg {
          width: 100%;
          height: 100%;
        }

        .causes-section {
          padding: 60px 0 80px;
          background: #fff;
        }
        .section-header {
          text-align: center;
          margin-bottom: 45px;
        }
        .section-title {
          font-size: 38px;
          color: #1e3a5f;
          margin: 0 0 10px;
          font-weight: 800;
        }
        .section-title.white { color: white; }
        .section-desc {
          color: #64748b;
          font-size: 18px;
          margin: 0;
        }
        .causes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
          margin-bottom: 50px;
        }
        .cause-card {
          background: white;
          padding: 30px;
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.4s ease;
          border: 3px solid #f1f5f9;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        .cause-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
        }
        .cause-card.selected {
          border-color: var(--accent, #8b5cf6);
          box-shadow: 0 20px 50px rgba(139, 92, 246, 0.2);
        }
        .cause-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .cause-icon {
          font-size: 48px;
        }
        .cause-badge {
          background: #dcfce7;
          color: #166534;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        .cause-card h3 {
          font-size: 22px;
          color: #1e3a5f;
          margin: 0 0 8px;
        }
        .cause-card p {
          color: #64748b;
          font-size: 15px;
          margin: 0 0 20px;
        }
        .progress-track {
          height: 10px;
          background: #f1f5f9;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }
        .progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #64748b;
        }

        .donation-container {
          max-width: 520px;
          margin: 0 auto;
        }
        .donation-card {
          background: white;
          padding: 40px;
          border-radius: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .card-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .card-header h3 {
          font-size: 26px;
          color: #1e3a5f;
          margin: 0 0 8px;
        }
        .card-header p {
          color: #64748b;
          margin: 0;
        }
        
        .amount-grid {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .amount-btn {
          padding: 16px 28px;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 14px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .amount-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }
        .amount-btn.active {
          background: #8b5cf6;
          color: white;
          border-color: #8b5cf6;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.35);
        }
        
        .custom-amount {
          margin-bottom: 28px;
        }
        .custom-amount label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1e3a5f;
          margin-bottom: 10px;
        }
        .amount-input {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
        }
        .currency {
          padding: 16px;
          background: #e2e8f0;
          font-size: 20px;
          font-weight: 700;
          color: #1e3a5f;
        }
        .amount-input input {
          flex: 1;
          padding: 16px;
          border: none;
          background: transparent;
          font-size: 22px;
          font-weight: 700;
          outline: none;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1e3a5f;
          margin-bottom: 10px;
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          font-size: 16px;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }
        
        .donate-btn {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .donate-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
        }
        .donate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .impact-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #1e3a5f, #3b82f6);
        }
        .impact-grid {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }
        .impact-card {
          text-align: center;
          background: rgba(255,255,255,0.1);
          padding: 35px 40px;
          border-radius: 24px;
          min-width: 180px;
        }
        .impact-circle {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .impact-icon {
          font-size: 36px;
        }
        .impact-num {
          display: block;
          font-size: 36px;
          font-weight: 800;
          color: white;
        }
        .impact-label {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
        }

        .donation-footer {
          background: #0f172a;
          padding: 28px 0;
          text-align: center;
        }
        .donation-footer p {
          color: rgba(255,255,255,0.5);
          margin: 0;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
        }

        @media (max-width: 768px) {
          .causes-grid {
            grid-template-columns: 1fr;
          }
          .header-nav {
            display: none;
          }
          .donation-hero h1 {
            font-size: 36px;
          }
          .hero-stats {
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}