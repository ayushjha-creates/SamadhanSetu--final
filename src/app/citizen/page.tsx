'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ReportModal from '../components/ReportModal/ReportModal';
import Card from '../components/Card/Card';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/app/providers';
import { Report } from '@/types';

const LeafletMap = dynamic(() => import('../components/LeafletMap/LeafletMap'), { ssr: false });

export default function CitizenDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'reports'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const fetchReports = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success) {
        // Filter to show only this user's reports
        const userReports = data.data.filter((r: Report) => r.by === user.id || r.by === 'anonymous');
        setReports(userReports);
        setStats({
          total: userReports.length,
          pending: userReports.filter((r: Report) => r.status === 'new').length,
          resolved: userReports.filter((r: Report) => r.status === 'resolved').length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user, fetchReports]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
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
        await fetchReports();
        setShowModal(false);
        alert('Report submitted successfully! 🚀\n\nYou can track it in "My Reports"');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const menuItems = [
    { icon: '📢', label: 'Report Issue', color: '#3498db', action: () => setShowModal(true) },
    { icon: '📋', label: 'My Reports', color: '#9b59b6', action: () => setActiveTab('reports') },
    { icon: '🗺️', label: 'View Map', color: '#e67e22', action: () => setActiveTab('map') },
    { icon: '🏆', label: 'Leaderboard', color: '#f1c40f', action: () => router.push('/natureheroes') },
    { icon: '🎁', label: 'Rewards', color: '#2ecc71', action: () => router.push('/natureheroes') },
  ];

  if (authLoading || loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">{user.full_name?.charAt(0) || 'U'}</div>
          <div className="user-info">
            <span className="user-name">{user.full_name}</span>
            <span className="user-role">{user.role === 'admin' ? 'Administrator' : user.role === 'cityofficial' ? 'City Official' : 'Citizen'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span className="link-icon">🏠</span>
            <span className="link-label">Dashboard</span>
          </a>
          <a href="#" className={`sidebar-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <span className="link-icon">📋</span>
            <span className="link-label">My Reports</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => setActiveTab('map')}>
            <span className="link-icon">🗺️</span>
            <span className="link-label">Map View</span>
          </a>
          <a href="/natureheroes" className="sidebar-link">
            <span className="link-icon">🏆</span>
            <span className="link-label">Leaderboard</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="sidebar-btn">
            {isDark ? '☀️' : '🌙'} {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleLogout} className="sidebar-btn logout">
            🚪 Logout
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>Welcome back, {user.full_name?.split(' ')[0]}! 👋</h1>
            <p>Track and manage your civic reports</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Report Issue
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">📊</span>
                <div className="stat-info">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">My Reports</span>
                </div>
              </div>
              <div className="stat-card pending">
                <span className="stat-icon">⏳</span>
                <div className="stat-info">
                  <span className="stat-value">{stats.pending}</span>
                  <span className="stat-label">Pending</span>
                </div>
              </div>
              <div className="stat-card resolved">
                <span className="stat-icon">✅</span>
                <div className="stat-info">
                  <span className="stat-value">{stats.resolved}</span>
                  <span className="stat-label">Resolved</span>
                </div>
              </div>
            </div>

            <div className="menu-grid">
              {menuItems.map((item, i) => (
                <button key={i} className="menu-card" onClick={item.action}>
                  <div className="menu-icon" style={{ background: item.color }}>{item.icon}</div>
                  <span className="menu-label">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="recent-section">
              <div className="section-header">
                <h2>My Recent Reports</h2>
                <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('reports')}>View All</button>
              </div>
              {reports.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📝</span>
                  <h3>No reports yet</h3>
                  <p>Start by reporting an issue in your area</p>
                  <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + Report Your First Issue
                  </button>
                </div>
              ) : (
                <div className="reports-grid">
                  {reports.slice(0, 3).map((report) => (
                    <Card key={report.id} report={report} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'map' && (
          <div className="map-view">
            <h2>My Issues on Map</h2>
            <div className="map-container">
              <LeafletMap
                markers={reports.map((r) => ({
                  position: [r.location.lat, r.location.lng] as [number, number],
                  popup: r.title,
                  type: 'issue' as const,
                }))}
                height="calc(100vh - 200px)"
              />
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-view">
            <h2>All My Reports ({reports.length})</h2>
            {reports.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <h3>No reports submitted</h3>
                <p>Your submitted reports will appear here</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  + Report an Issue
                </button>
              </div>
            ) : (
              <div className="reports-grid">
                {reports.map((report) => (
                  <Card key={report.id} report={report} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <ReportModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleSubmitReport} />

      <style jsx>{`
        .loading-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: #f8f9fa;
        }
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e0e0e0;
          border-top-color: #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }
        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #1e3a5f 0%, #0d1b2a 100%);
          color: white;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 24px;
        }
        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3498db, #2ecc71);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
        }
        .user-info { display: flex; flex-direction: column; }
        .user-name { font-weight: 600; font-size: 15px; }
        .user-role { font-size: 12px; opacity: 0.7; }
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: rgba(255,255,255,0.8);
          transition: all 0.2s;
        }
        .sidebar-link:hover { background: rgba(255,255,255,0.1); color: white; }
        .sidebar-link.active { background: rgba(255,255,255,0.15); color: white; }
        .link-icon { font-size: 18px; }
        .link-label { font-size: 14px; font-weight: 500; }
        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .sidebar-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 14px;
          width: 100%;
          justify-content: center;
          border: none;
          cursor: pointer;
        }
        .sidebar-btn:hover { background: rgba(255,255,255,0.2); }
        .sidebar-btn.logout { background: rgba(231, 76, 60, 0.2); }
        .sidebar-btn.logout:hover { background: rgba(231, 76, 60, 0.3); }
        .main-content {
          margin-left: 260px;
          flex: 1;
          padding: 32px;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .page-header h1 { font-size: 28px; margin-bottom: 4px; color: #1a1a2e; }
        .page-header p { color: #666; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .stat-icon { font-size: 32px; }
        .stat-value { font-size: 28px; font-weight: 700; display: block; color: #1a1a2e; }
        .stat-label { color: #666; font-size: 14px; }
        .menu-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 32px; }
        .menu-card {
          background: white;
          padding: 24px 16px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          border: none;
        }
        .menu-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .menu-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .menu-label { font-weight: 500; font-size: 13px; color: #1a1a2e; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .section-header h2 { font-size: 20px; color: #1a1a2e; }
        .reports-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .empty-state {
          text-align: center;
          padding: 60px 40px;
          background: white;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .empty-icon { font-size: 64px; display: block; margin-bottom: 16px; }
        .empty-state h3 { margin-bottom: 8px; color: #1a1a2e; }
        .empty-state p { color: #666; margin-bottom: 20px; }
        .map-view h2, .reports-view h2 { margin-bottom: 20px; font-size: 20px; color: #1a1a2e; }
        .map-container { border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        @media (max-width: 1200px) { .menu-grid { grid-template-columns: repeat(3, 1fr); } .reports-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .stats-grid, .menu-grid, .reports-grid { grid-template-columns: 1fr; } .sidebar { display: none; } .main-content { margin-left: 0; } }
      `}</style>
    </div>
  );
}