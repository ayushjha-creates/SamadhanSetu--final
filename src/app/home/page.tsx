'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ReportModal from '../components/ReportModal/ReportModal';
import Card from '../components/Card/Card';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/app/providers';
import { Report } from '@/types';

const LeafletMap = dynamic(() => import('../components/LeafletMap/LeafletMap'), { ssr: false });

export default function HomePage() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [reports, setReports] = useState<Report[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    fetchReports();
  }, [categoryFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = categoryFilter ? `?category=${categoryFilter}` : '';
      const res = await fetch(`/api/reports${params}`);
      const data = await res.json();
      if (data.success) setReports(data.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (data: any) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        fetchReports();
        alert('Report submitted successfully!');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const mapMarkers = reports.map((r) => ({
    position: [r.location.lat, r.location.lng] as [number, number],
    popup: r.title,
    type: 'issue' as const,
  }));

  const navItems = [
    { icon: '🏠', label: 'Home', href: '/home' },
    { icon: '🗺️', label: 'Map', href: '/viewmap' },
    { icon: '💝', label: 'Donate', href: '/donation' },
    { icon: '🌿', label: 'EcoVoice', href: '/ecovoice' },
    { icon: '🌳', label: 'Nature', href: '/natureheroes' },
  ];

  const translations: Record<string, Record<string, string>> = {
    EN: {
      home: 'Home', map: 'Map', donate: 'Donate', ecovoice: 'EcoVoice', nature: 'Nature',
      reportIssue: 'Report Issue', login: 'Login', dashboard: 'Dashboard', signup: 'Sign Up',
      yourVoice: 'Your Voice, Our Action', heroDesc: 'Report civic issues and track their resolution. Together, we build a better city.',
      reportBtn: 'Report an Issue', viewMap: 'View Issues Map',
      issuesReported: 'Issues Reported', resolutionRate: 'Resolution Rate', activeCitizens: 'Active Citizens', support: 'Support',
      howItWorks: 'How It Works', howDesc: 'Three simple steps to get your civic issues resolved',
      snapPhoto: 'Snap a Photo', snapDesc: 'Take a picture of any civic issue in your area',
      pinLocation: 'Pin Location', pinDesc: 'Mark the exact location on the map',
      getResolution: 'Get Resolution', getDesc: 'Track status and get notified when fixed',
      issuesIn: 'Issues Near You', latestReports: 'Latest Reports',
      allIssues: 'All Issues', potholes: 'Potholes', garbage: 'Garbage', lights: 'Lights', water: 'Water',
      noReports: 'No issues reported yet. Be the first!',
      quickLinks: 'Quick Links', contactUs: 'Contact Us', email: 'help@samadhansetu.gov.in', phone: '1800-123-4567', address: 'Bhopal Municipal Corporation',
      rights: 'All Rights Reserved.',
    },
    HI: {
      home: 'होम', map: 'नक्शा', donate: 'दान', ecovoice: 'इकोवॉइस', nature: 'प्रकृति',
      reportIssue: 'शिकायत करें', login: 'लॉगिन', dashboard: 'डैशबोर्ड', signup: 'साइन अप',
      yourVoice: 'आपकी आवाज, हमारी कार्रवाई', heroDesc: 'नागरिक मुद्दों की शिकायत करें और समाधान ट्रैक करें। मिलकर एक बेहतर शहर बनाएं।',
      reportBtn: 'शिकायत करें', viewMap: 'नक्शा देखें',
      issuesReported: 'शिकायतें', resolutionRate: 'समाधान दर', activeCitizens: 'सक्रिय नागरिक', support: 'सहायता',
      howItWorks: 'कैसे काम करता है', howDesc: 'अपनी शिकायतों को हल करने के तीन आसान चरण',
      snapPhoto: 'फोटो लें', snapDesc: 'अपने क्षेत्र की कोई भी समस्या की तस्वीर लें',
      pinLocation: 'स्थान चिह्नित करें', pinDesc: 'नक्शे पर सही स्थान चिह्नित करें',
      getResolution: 'समाधान पाएं', getDesc: 'स्थिति ट्रैक करें और जब ठीक होने पर सूचित हों',
      issuesIn: 'आपके आसपास की समस्याएं', latestReports: 'नवीनतम रिपोर्ट',
      allIssues: 'सभी', potholes: 'गड्ढे', garbage: 'कचरा', lights: 'लाइट', water: 'पानी',
      noReports: 'अभी तक कोई शिकायत नहीं। पहले शिकायत करें!',
      quickLinks: 'त्वरित लिंक', contactUs: 'संपर्क करें', email: 'help@samadhansetu.gov.in', phone: '1800-123-4567', address: 'भोपाल नगरपालिका',
      rights: 'सर्वाधिकार सुरक्षित।',
    }
  };

  const t = translations[lang];

  return (
    <div className="home-page">
      {/* Header */}
      <header className="main-header">
        <div className="container header-container">
          <Link href="/" className="logo-section">
            <img src="/logo.png" alt="Samadhan Setu" className="logo-img" />
            <div className="logo-texts">
              <span className="logo-title">Samadhan Setu</span>
              <span className="logo-subtitle">Civic Portal</span>
            </div>
          </Link>

          <nav className="nav-links">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="nav-item">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <select className="lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="EN">🌐 EN</option>
              <option value="HI">🌐 हि</option>
            </select>
            
            <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
              {isDark ? '☀️' : '🌙'}
            </button>

            <Link href="/login" className="nav-item login-item">
              <span className="nav-icon">🔑</span>
              <span className="nav-text">{t.login}</span>
            </Link>

            <Link href="/signup" className="nav-item signup-item">
              <span className="nav-icon">✍️</span>
              <span className="nav-text">{t.signup}</span>
            </Link>

            <button className="report-btn-header" onClick={() => setShowModal(true)}>
              ⚠️ Report
            </button>

            {user && (
              <Link href="/citizen" className="nav-item dash-item">
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>{t.yourVoice}</h1>
            <p>{t.heroDesc}</p>
            <div className="hero-btns">
              <button className="btn-primary-hero" onClick={() => setShowModal(true)}>
                📸 {t.reportBtn}
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-box">
                <span className="stat-num">{reports.length || '2,450'}+</span>
                <span className="stat-lbl">{t.issuesReported}</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">89%</span>
                <span className="stat-lbl">{t.resolutionRate}</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">15K+</span>
                <span className="stat-lbl">{t.activeCitizens}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave */}
      <div className="wave-top">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none"><path fill="#f8fafc" d="M0,64 C288,120 576,0 864,64 C1152,128 1440,32 1440,32 L1440,120 L0,120 Z"></path></svg>
      </div>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <h2 className="section-title">{t.howItWorks}</h2>
          <p className="section-subtitle">{t.howDesc}</p>
          <div className="steps-flow">
            <div className="step-card">
              <div className="step-num">1</div>
              <div className="step-emoji">📸</div>
              <h3>{t.snapPhoto}</h3>
              <p>{t.snapDesc}</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-num">2</div>
              <div className="step-emoji">📍</div>
              <h3>{t.pinLocation}</h3>
              <p>{t.pinDesc}</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-num">3</div>
              <div className="step-emoji">✅</div>
              <h3>{t.getResolution}</h3>
              <p>{t.getDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Wave */}
      <div className="wave-dark">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none"><path fill="#1e3a5f" d="M0,64 C288,120 576,0 864,64 C1152,128 1440,32 1440,32 L1440,120 L0,120 Z"></path></svg>
      </div>

      {/* Map */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title light">{t.issuesIn}</h2>
          <div className="map-box">
            <LeafletMap markers={mapMarkers} height="420px" />
          </div>
        </div>
      </section>

      {/* Reports */}
      <section className="reports-section">
        <div className="container">
          <h2 className="section-title">{t.latestReports}</h2>
          <div className="filter-row">
            <button className={`filter-chip ${!categoryFilter ? 'active' : ''}`} onClick={() => setCategoryFilter('')}>{t.allIssues}</button>
            <button className={`filter-chip ${categoryFilter === 'pothole' ? 'active' : ''}`} onClick={() => setCategoryFilter('pothole')}>🕳️ {t.potholes}</button>
            <button className={`filter-chip ${categoryFilter === 'garbage' ? 'active' : ''}`} onClick={() => setCategoryFilter('garbage')}>🗑️ {t.garbage}</button>
            <button className={`filter-chip ${categoryFilter === 'streetlight' ? 'active' : ''}`} onClick={() => setCategoryFilter('streetlight')}>💡 {t.lights}</button>
            <button className={`filter-chip ${categoryFilter === 'water_leak' ? 'active' : ''}`} onClick={() => setCategoryFilter('water_leak')}>💧 {t.water}</button>
          </div>
          <div className="reports-masonry">
            {reports.slice(0, 6).map((report) => (
              <Card key={report.id} report={report} />
            ))}
            {reports.length === 0 && !loading && (
              <div className="empty-msg">{t.noReports}</div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/logo.png" alt="Samadhan Setu" className="footer-logo" />
              <h3>Samadhan Setu</h3>
              <p>Empowering citizens to build a better city through civic engagement and digital governance.</p>
            </div>
            <div className="footer-nav">
              <h4>{t.quickLinks}</h4>
              <a href="/home">{t.home}</a>
              <a href="/viewmap">{t.map}</a>
              <a href="/donation">{t.donate}</a>
              <a href="/ecovoice">{t.ecovoice}</a>
            </div>
            <div className="footer-contact">
              <h4>{t.contactUs}</h4>
              <p>📧 {t.email}</p>
              <p>📞 {t.phone}</p>
              <p>📍 {t.address}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Samadhan Setu. {t.rights}</p>
          </div>
        </div>
      </footer>

      {showModal && (
        <ReportModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleSubmitReport} />
      )}

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
          background: #f8fafc;
        }
        
        .main-header {
          background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
          padding: 10px 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(30, 58, 95, 0.35);
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-img {
          height: 52px;
          width: auto;
          border-radius: 10px;
          background: transparent !important;
          mix-blend-mode: lighten;
        }
        .logo-texts {
          display: flex;
          flex-direction: column;
        }
        .logo-title {
          font-size: 24px;
          font-weight: 800;
          color: white;
          line-height: 1.2;
        }
        .logo-subtitle {
          font-size: 12px;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
        }
        
        .nav-links {
          display: flex;
          gap: 16px;
          flex-wrap: nowrap;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 22px;
          background: transparent;
          border: 3px solid rgba(255,255,255,0.5);
          border-radius: 12px;
          color: white;
          text-decoration: none;
          font-size: 17px;
          font-weight: 700;
          white-space: nowrap;
          transition: all 0.3s;
        }
        .nav-item:hover {
          background: rgba(255,255,255,0.15);
          border-color: white;
          transform: translateY(-3px);
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }
        .lang-select {
          padding: 10px 14px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .lang-select option {
          background: #1e3a5f;
          color: white;
        }
        .icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(255,255,255,0.15);
          border: none;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.25);
        }
.report-btn-header {
          padding: 14px 24px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: 3px solid #22c55e;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
        }
        .report-btn-header:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.5);
        }
        .login-item {
          background: transparent !important;
          color: #3b82f6 !important;
          border: 3px solid #3b82f6 !important;
          padding: 12px 20px !important;
          border-radius: 12px !important;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .login-item:hover {
          background: #3b82f6 !important;
          color: white !important;
        }
        .signup-item {
          background: transparent !important;
          color: #f97316 !important;
          border: 3px solid #f97316 !important;
          padding: 12px 20px !important;
          border-radius: 12px !important;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .signup-item:hover {
          background: #f97316 !important;
          color: white !important;
        }
        .dash-item {
          background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
          color: white !important;
          border: 3px solid #8b5cf6 !important;
          padding: 12px 20px !important;
          border-radius: 12px !important;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dash-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }
        .nav-icon {
          font-size: 16px;
        }
        }
        .dash-btn {
          background: white;
          color: #1e3a5f;
          border: none;
        }
        .signup-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white !important;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }
        .signup-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        /* Hero */
        .hero-section {
          position: relative;
          padding: 100px 0;
          text-align: center;
          color: white;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1524492412937-b280feaeb979?w=1600') center/cover no-repeat;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(30, 58, 95, 0.92), rgba(37, 99, 235, 0.88));
        }
        .hero-content {
          position: relative;
          z-index: 1;
        }
        .hero-content h1 {
          font-size: 58px;
          font-weight: 800;
          margin: 0 0 20px;
          letter-spacing: -1.5px;
        }
        .hero-content p {
          font-size: 22px;
          margin: 0 0 35px;
          opacity: 0.95;
        }
        .hero-btns {
          display: flex;
          gap: 18px;
          justify-content: center;
          margin-bottom: 45px;
        }
        .btn-primary-hero, .btn-secondary-hero {
          padding: 20px 40px;
          border-radius: 14px;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.35s;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .btn-primary-hero {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          box-shadow: 0 8px 30px rgba(249, 115, 22, 0.45);
        }
        .btn-primary-hero:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(249, 115, 22, 0.55);
        }
        .btn-secondary-hero {
          background: white;
          color: #1e3a5f;
          border: 4px solid white;
          font-weight: 700;
        }
        .btn-secondary-hero:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
        }
        .stat-box {
          background: rgba(255,255,255,0.12);
          padding: 20px 32px;
          border-radius: 14px;
          backdrop-filter: blur(10px);
        }
        .stat-num {
          display: block;
          font-size: 36px;
          font-weight: 800;
        }
        .stat-lbl {
          font-size: 14px;
          opacity: 0.85;
        }

        /* Waves */
        .wave-top, .wave-dark {
          height: 70px;
          margin-top: -1px;
        }
        .wave-top svg, .wave-dark svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* How Section */
        .how-section {
          padding: 70px 0;
          background: #f8fafc;
        }
        .section-title {
          font-size: 38px;
          text-align: center;
          color: #1e3a5f;
          margin: 0 0 10px;
          font-weight: 800;
        }
        .section-subtitle {
          text-align: center;
          color: #64748b;
          font-size: 17px;
          margin: 0 0 45px;
        }
        .section-title.light {
          color: white;
        }
        .steps-flow {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .step-card {
          background: white;
          padding: 38px 28px;
          border-radius: 18px;
          text-align: center;
          width: 250px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transition: all 0.4s;
        }
        .step-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 18px 45px rgba(37, 99, 235, 0.2);
        }
        .step-num {
          width: 36px;
          height: 36px;
          background: #1e3a5f;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          margin: 0 auto 14px;
        }
        .step-emoji {
          font-size: 48px;
          margin-bottom: 14px;
        }
        .step-card h3 {
          font-size: 20px;
          color: #1e3a5f;
          margin: 0 0 8px;
        }
        .step-card p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
        .step-arrow {
          font-size: 30px;
          color: #2563eb;
          font-weight: 700;
        }

        /* Map */
        .map-section {
          padding: 70px 0;
          background: linear-gradient(135deg, #1e3a5f, #2563eb);
        }
        .map-box {
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 45px rgba(0,0,0,0.3);
        }

        /* Reports */
        .reports-section {
          padding: 70px 0;
          background: #f8fafc;
        }
        .filter-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .filter-chip {
          padding: 12px 24px;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .filter-chip:hover {
          border-color: #2563eb;
          color: #2563eb;
        }
        .filter-chip.active {
          background: #1e3a5f;
          color: white;
          border-color: #1e3a5f;
        }
        .reports-masonry {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 24px;
        }
        .empty-msg {
          grid-column: 1 / -1;
          text-align: center;
          padding: 50px;
          font-size: 18px;
          color: #94a3b8;
        }

        /* Footer */
        .site-footer {
          background: #0f172a;
          color: white;
          padding: 60px 0 20px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 50px;
        }
        .footer-logo {
          height: 48px;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .footer-brand h3 {
          font-size: 22px;
          margin: 0 0 10px;
        }
        .footer-brand p {
          font-size: 15px;
          opacity: 0.8;
          line-height: 1.6;
        }
        .footer-nav h4, .footer-contact h4 {
          font-size: 16px;
          margin: 0 0 16px;
          opacity: 0.9;
        }
        .footer-nav a {
          display: block;
          color: white;
          text-decoration: none;
          font-size: 15px;
          opacity: 0.8;
          margin-bottom: 10px;
          transition: all 0.2s;
        }
        .footer-nav a:hover {
          opacity: 1;
          color: #60a5f9;
        }
        .footer-contact p {
          font-size: 15px;
          opacity: 0.8;
          margin: 0 0 8px;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          margin-top: 40px;
          padding-top: 18px;
          text-align: center;
        }
        .footer-bottom p {
          font-size: 13px;
          opacity: 0.5;
          margin: 0;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
        }

        @media (max-width: 900px) {
          .header-container {
            flex-wrap: wrap;
            gap: 12px;
          }
          .nav-links {
            order: 3;
            width: 100%;
            justify-content: center;
          }
          .hero-content h1 {
            font-size: 36px;
          }
          .hero-btns {
            flex-direction: column;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}