'use client';

import { useState } from 'react';
import { useTheme } from '../providers';
import Link from 'next/link';

const heroes = [
  { id: 1, name: 'Priya Sharma', area: 'MP Nagar', reports: 156, points: 2850, badge: '🌟', avatar: 'PS' },
  { id: 2, name: 'Rahul Verma', area: 'Arera Colony', reports: 134, points: 2340, badge: '⭐', avatar: 'RV' },
  { id: 3, name: 'Anita Desai', area: 'Bawaria Kalan', reports: 98, points: 1820, badge: '🌟', avatar: 'AD' },
  { id: 4, name: 'Vikram Singh', area: 'Kolar Road', reports: 87, points: 1560, badge: '⭐', avatar: 'VS' },
  { id: 5, name: 'Meera Patel', area: 'Habibganj', reports: 76, points: 1340, badge: '🌿', avatar: 'MP' },
  { id: 6, name: 'Amit Kumar', area: 'TT Nagar', reports: 65, points: 1120, badge: '🌿', avatar: 'AK' },
  { id: 7, name: 'Sunita Rao', area: 'Shivaji Nagar', reports: 54, points: 980, badge: '🌱', avatar: 'SR' },
];

const badges = [
  { name: 'First Report', icon: '📍', requirement: 'Submit your first report', color: '#3498db' },
  { name: 'Cleaner', icon: '🧹', requirement: 'Report 10 garbage issues', color: '#2ecc71' },
  { name: 'Lamplighter', icon: '💡', requirement: 'Report 5 streetlight issues', color: '#f1c40f' },
  { name: 'Road Warrior', icon: '🛣️', requirement: 'Report 10 pothole issues', color: '#e67e22' },
  { name: 'Eco Warrior', icon: '🌱', requirement: 'Participate in 5 community events', color: '#27ae60' },
  { name: 'Champion', icon: '🏆', requirement: 'Reach 1000 points', color: '#9b59b6' },
];

export default function NatureHeroesPage() {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges' | 'rewards'>('leaderboard');

  return (
    <div className="heroes-page">
      <header className="heroes-header">
        <div className="container header-content">
          <Link href="/" className="logo-box">
            <img src="/logo.png" alt="Samadhan Setu" className="logo-img" />
            <span className="logo-text">Samadhan Setu</span>
          </Link>
          <nav className="header-nav">
            <Link href="/home" className="nav-link">🏠 Home</Link>
            <Link href="/viewmap" className="nav-link">🗺️ Map</Link>
            <Link href="/donation" className="nav-link">💝 Donate</Link>
            <Link href="/ecovoice" className="nav-link">🌿 EcoVoice</Link>
            <Link href="/natureheroes" className="nav-link active">🌳 Nature</Link>
          </nav>
          <button onClick={toggleTheme} className="theme-btn">{isDark ? '☀️' : '🌙'}</button>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-badge-icon">🏆</div>
          <h1>Nature Heroes</h1>
          <p>Celebrating citizens who make Bhopal greener and cleaner</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">15,234</span>
              <span className="stat-label">Total Citizens</span>
            </div>
            <div className="stat">
              <span className="stat-value">45,678</span>
              <span className="stat-label">Issues Resolved</span>
            </div>
            <div className="stat">
              <span className="stat-value">₹2.5M</span>
              <span className="stat-label">Donations Raised</span>
            </div>
          </div>
        </div>
      </section>

      <div className="tabs-wrapper">
        <div className="container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`} 
              onClick={() => setActiveTab('leaderboard')}
            >
              🏆 Leaderboard
            </button>
            <button 
              className={`tab ${activeTab === 'badges' ? 'active' : ''}`} 
              onClick={() => setActiveTab('badges')}
            >
              🏅 Badges
            </button>
            <button 
              className={`tab ${activeTab === 'rewards' ? 'active' : ''}`} 
              onClick={() => setActiveTab('rewards')}
            >
              🎁 Rewards
            </button>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container">
          {activeTab === 'leaderboard' && (
            <div className="leaderboard">
              <div className="podium">
                {[1, 0, 2].map((i) => {
                  const hero = heroes[i];
                  const medal = ['🥈', '🥇', '🥉'][i];
                  const colors = ['#e67e22', '#f1c40f', '#e74c3c'];
                  return (
                    <div key={hero.id} className={`podium-card rank-${i + 1}`} style={{ borderTop: `4px solid ${colors[i]}` }}>
                      <span className="medal">{medal}</span>
                      <div className="avatar" style={{ background: colors[i] }}>{hero.avatar}</div>
                      <h3>{hero.name}</h3>
                      <p className="area">{hero.area}</p>
                      <div className="stats">
                        <span>📋 {hero.reports}</span>
                        <span>⭐ {hero.points}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="leaderboard-list">
                <h3>Full Rankings</h3>
                {heroes.map((hero, i) => (
                  <div key={hero.id} className="leader-row">
                    <span className="rank">#{i + 1}</span>
                    <div className="user-info">
                      <div className="avatar-sm" style={{ background: `hsl(${hero.id * 50}, 60%, 50%)` }}>{hero.avatar}</div>
                      <div>
                        <span className="name">{hero.name}</span>
                        <span className="area-sm">{hero.area}</span>
                      </div>
                    </div>
                    <div className="user-stats">
                      <span>{hero.reports} reports</span>
                      <span className="points">{hero.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="badges-grid">
              {badges.map((badge) => (
                <div key={badge.name} className="badge-card" style={{ borderTop: `4px solid ${badge.color}` }}>
                  <div className="badge-icon" style={{ background: badge.color }}>{badge.icon}</div>
                  <h3>{badge.name}</h3>
                  <p>{badge.requirement}</p>
                  <button className="badge-btn" style={{ background: badge.color }}>Earn This Badge</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="rewards-list">
              <div className="reward-card">
                <div className="reward-icon">🌿</div>
                <div className="reward-info">
                  <h3>Green Tier</h3>
                  <span className="points-req">500+ Points</span>
                </div>
                <ul>
                  <li>✅ Digital certificate of appreciation</li>
                  <li>✅ Feature on the homepage</li>
                  <li>✅ Priority support channel</li>
                </ul>
              </div>
              <div className="reward-card">
                <div className="reward-icon">⭐</div>
                <div className="reward-info">
                  <h3>Silver Tier</h3>
                  <span className="points-req">1500+ Points</span>
                </div>
                <ul>
                  <li>✅ All Green Tier rewards</li>
                  <li>✅ Samadhan Setu merchandise</li>
                  <li>✅ Exclusive community events</li>
                </ul>
              </div>
              <div className="reward-card featured">
                <div className="reward-icon">🏆</div>
                <div className="reward-info">
                  <h3>Gold Tier</h3>
                  <span className="points-req">3000+ Points</span>
                </div>
                <ul>
                  <li>✅ All Silver Tier rewards</li>
                  <li>✅ City-level recognition event</li>
                  <li>✅ Meet the Mayor</li>
                  <li>✅ Special profile badge</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="heroes-footer">
        <p>© 2024 Samadhan Setu - Together We Build a Better Bhopal</p>
      </footer>

      <style jsx>{`
        .heroes-page {
          min-height: 100vh;
          background: var(--background-light);
        }
        [data-theme="dark"] .heroes-page {
          background: var(--background-dark);
        }
        .heroes-header {
          background: linear-gradient(135deg, #1e3a5f, #2563eb);
          padding: 10px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-box {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-img {
          height: 44px;
          border-radius: 8px;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }
        .header-nav {
          display: flex;
          gap: 12px;
        }
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 8px;
          transition: all 0.3s;
        }
        .nav-link:hover, .nav-link.active {
          background: rgba(255,255,255,0.15);
          border-color: white;
        }
        .theme-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(255,255,255,0.15);
          border: none;
          font-size: 16px;
          cursor: pointer;
        }
        .hero-section {
          background: linear-gradient(135deg, #1e8449, #27ae60);
          padding: 80px 0;
          text-align: center;
          color: white;
        }
        .hero-badge-icon { font-size: 80px; margin-bottom: 16px; }
        .hero-section h1 { font-size: 48px; margin-bottom: 12px; }
        .hero-section p { font-size: 20px; opacity: 0.9; margin-bottom: 40px; }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 60px;
        }
        .stat-value {
          display: block;
          font-size: 36px;
          font-weight: 700;
        }
        .stat-label { font-size: 14px; opacity: 0.8; }
        .tabs-wrapper {
          background: var(--card-light);
          border-bottom: 1px solid var(--border-light);
        }
        [data-theme="dark"] .tabs-wrapper {
          background: var(--card-dark);
          border-color: var(--border-dark);
        }
        .tabs { display: flex; gap: 8px; }
        .tab {
          padding: 18px 28px;
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-muted);
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab.active { color: #27ae60; border-bottom-color: #27ae60; }
        .content { padding: 48px 0; }
        .podium {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 48px;
        }
        .podium-card {
          background: var(--card-light);
          padding: 32px 28px;
          border-radius: 16px;
          text-align: center;
          box-shadow: var(--shadow-md);
          min-width: 200px;
        }
        [data-theme="dark"] .podium-card {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .podium-card.rank-1 { order: 2; transform: scale(1.05); }
        .podium-card.rank-2 { order: 1; }
        .podium-card.rank-3 { order: 3; }
        .medal { font-size: 36px; display: block; margin-bottom: 12px; }
        .avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 22px;
          margin: 0 auto 12px;
        }
        .podium-card h3 { margin-bottom: 4px; color: var(--text-primary); }
        [data-theme="dark"] .podium-card h3 { color: var(--text-light); }
        .area { color: var(--text-muted); font-size: 14px; margin-bottom: 12px; }
        .stats { display: flex; gap: 16px; justify-content: center; font-size: 14px; color: var(--text-muted); }
        .leaderboard-list {
          background: var(--card-light);
          border-radius: 16px;
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        [data-theme="dark"] .leaderboard-list {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .leaderboard-list h3 { margin-bottom: 20px; color: var(--text-primary); }
        [data-theme="dark"] .leaderboard-list h3 { color: var(--text-light); }
        .leader-row {
          display: flex;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid var(--border-light);
        }
        [data-theme="dark"] .leader-row { border-color: var(--border-dark); }
        .leader-row:last-child { border: none; }
        .rank { width: 48px; font-weight: 600; color: var(--text-muted); }
        .user-info { flex: 1; display: flex; align-items: center; gap: 12px; }
        .avatar-sm {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }
        .name { display: block; font-weight: 600; color: var(--text-primary); }
        [data-theme="dark"] .name { color: var(--text-light); }
        .area-sm { font-size: 13px; color: var(--text-muted); }
        .user-stats { text-align: right; }
        .user-stats span { display: block; font-size: 13px; color: var(--text-muted); }
        .points { font-weight: 600; color: #27ae60 !important; }
        .badges-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .badge-card {
          background: var(--card-light);
          padding: 32px;
          border-radius: 16px;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }
        [data-theme="dark"] .badge-card {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .badge-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 16px;
        }
        .badge-card h3 { margin-bottom: 8px; color: var(--text-primary); }
        [data-theme="dark"] .badge-card h3 { color: var(--text-light); }
        .badge-card p { color: var(--text-muted); font-size: 14px; margin-bottom: 16px; }
        .badge-btn {
          padding: 10px 20px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 13px;
        }
        .rewards-list { display: flex; flex-direction: column; gap: 20px; }
        .reward-card {
          background: var(--card-light);
          padding: 28px 32px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: var(--shadow-sm);
        }
        [data-theme="dark"] .reward-card {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .reward-card.featured { border: 2px solid #f1c40f; }
        .reward-icon { font-size: 48px; }
        .reward-info { min-width: 180px; }
        .reward-info h3 { margin-bottom: 4px; color: var(--text-primary); }
        [data-theme="dark"] .reward-info h3 { color: var(--text-light); }
        .points-req { color: #27ae60; font-weight: 600; font-size: 14px; }
        .reward-card ul { flex: 1; list-style: none; }
        .reward-card ul li { padding: 6px 0; color: var(--text-secondary); font-size: 14px; }
        .heroes-footer { padding: 24px; text-align: center; color: var(--text-muted); font-size: 14px; }
        @media (max-width: 900px) {
          .podium { flex-direction: column; align-items: center; }
          .podium-card.rank-1 { transform: none; }
          .badges-grid { grid-template-columns: 1fr; }
          .hero-stats { flex-direction: column; gap: 24px; }
          .reward-card { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}