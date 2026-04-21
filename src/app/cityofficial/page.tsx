'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar/Sidebar';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/authContext';
import { Report, ReportStatus } from '@/types';

const LeafletMap = dynamic(() => import('../components/LeafletMap/LeafletMap'), { ssr: false });

export default function CityOfficialDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, highPriority: 0 });
  const [activeTab, setActiveTab] = useState<'all' | 'map' | 'analytics'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'cityofficial' && user.role !== 'admin'))) {
      router.push('/login');
    } else {
      fetchReports();
    }
  }, [user, loading, router]);

  const fetchReports = async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (priorityFilter) params.set('priority', priorityFilter);
    
    const res = await fetch(`/api/reports?${params}`);
    const data = await res.json();
    if (data.success) {
      setReports(data.data);
      setStats(data.stats);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, priorityFilter]);

  const updateReportStatus = async (reportId: string, status: ReportStatus) => {
    const res = await fetch('/api/reports', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reportId, status }),
    });
    const data = await res.json();
    if (data.success) {
      fetchReports();
      setSelectedReport(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar type="official" />
      
      <main className="main-content">
        <header className="page-header">
          <h1>City Official Dashboard</h1>
          <p>Manage and resolve civic reports</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card total">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Issues</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">New</span>
          </div>
          <div className="stat-card in-progress">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card resolved">
            <span className="stat-value">{stats.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
          <div className="stat-card critical">
            <span className="stat-value">{stats.highPriority}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            All Issues
          </button>
          <button className={`tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            Map View
          </button>
          <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            Analytics
          </button>
        </div>

        {activeTab === 'all' && (
          <div className="issues-table">
            <div className="table-filters">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>#{report.id.slice(0, 6)}</td>
                    <td>{report.title}</td>
                    <td>{report.category}</td>
                    <td>
                      <span className={`badge badge-${report.priority}`}>{report.priority}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${report.status.replace('_', '-')}`}>{report.status.replace('_', ' ')}</span>
                    </td>
                    <td>{report.location.address}</td>
                    <td>
                      <select
                        value={report.status}
                        onChange={(e) => updateReportStatus(report.id, e.target.value as ReportStatus)}
                        className="status-select"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="map-view">
            <div className="map-container">
              <LeafletMap
                markers={reports.map((r) => ({
                  position: [r.location.lat, r.location.lng] as [number, number],
                  popup: r.title,
                  type: 'issue' as const,
                }))}
                height="600px"
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-view">
            <div className="analytics-card">
              <h3>Resolution Rate</h3>
              <div className="progress-ring">
                <span>{stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%</span>
              </div>
            </div>
            <div className="analytics-card">
              <h3>Category Breakdown</h3>
              <div className="category-list">
                {['pothole', 'streetlight', 'garbage', 'drainage', 'water_leak', 'tree_down'].map((cat) => {
                  const count = reports.filter((r) => r.category === cat).length;
                  return (
                    <div key={cat} className="category-item">
                      <span>{cat.replace('_', ' ')}</span>
                      <div className="category-bar">
                        <div className="bar-fill" style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }} />
                      </div>
                      <span>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .dashboard-layout { display: flex; min-height: 100vh; }
        .main-content { margin-left: 280px; flex: 1; padding: 32px; background: var(--background-light); }
        .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
        .spinner { width: 40px; height: 40px; border: 4px solid var(--border-light); border-top-color: var(--primary-blue); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .page-header { margin-bottom: 32px; }
        .page-header h1 { font-size: 28px; margin-bottom: 8px; }
        .page-header p { color: var(--text-muted); }
        .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: white; padding: 20px; border-radius: var(--border-radius); text-align: center; box-shadow: var(--shadow-sm); }
        .stat-value { font-size: 28px; font-weight: 700; display: block; }
        .stat-label { color: var(--text-muted); font-size: 12px; }
        .stat-card.total { border-left: 4px solid var(--primary-blue); }
        .stat-card.pending { border-left: 4px solid var(--warning-orange); }
        .stat-card.in-progress { border-left: 4px solid var(--status-in-progress); }
        .stat-card.resolved { border-left: 4px solid var(--secondary-green); }
        .stat-card.critical { border-left: 4px solid var(--danger-red); }
        .tabs { display: flex; gap: 8px; margin-bottom: 24px; }
        .tab { padding: 12px 24px; border-radius: var(--border-radius); background: white; border: none; cursor: pointer; font-weight: 500; transition: all var(--transition-fast); }
        .tab.active { background: var(--primary-blue); color: white; }
        .table-filters { display: flex; gap: 16px; margin-bottom: 16px; }
        .table-filters select { padding: 10px 16px; border: 2px solid var(--border-light); border-radius: var(--border-radius); background: white; }
        .issues-table { background: white; border-radius: var(--border-radius); overflow: hidden; box-shadow: var(--shadow-sm); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border-light); }
        th { background: var(--background-light); font-weight: 600; font-size: 14px; }
        td { font-size: 14px; }
        .status-select { padding: 8px 12px; border: 2px solid var(--border-light); border-radius: 8px; background: white; cursor: pointer; }
        .map-view .map-container { border-radius: var(--border-radius); overflow: hidden; box-shadow: var(--shadow-lg); }
        .analytics-view { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .analytics-card { background: white; padding: 24px; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); }
        .analytics-card h3 { margin-bottom: 16px; font-size: 18px; }
        .progress-ring { width: 120px; height: 120px; border-radius: 50%; border: 8px solid var(--border-light); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: var(--secondary-green); }
        .category-list { display: flex; flex-direction: column; gap: 12px; }
        .category-item { display: flex; align-items: center; gap: 12px; }
        .category-item > span:first-child { width: 100px; font-size: 14px; text-transform: capitalize; }
        .category-bar { flex: 1; height: 8px; background: var(--border-light); border-radius: 4px; }
        .bar-fill { height: 100%; background: var(--primary-blue); border-radius: 4px; transition: width var(--transition-normal); }
        @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .analytics-view { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}