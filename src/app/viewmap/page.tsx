'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/app/providers';
import Card from '@/app/components/Card/Card';
import { Report } from '@/types';

const LeafletMap = dynamic(() => import('@/app/components/LeafletMap/LeafletMap'), { ssr: false });

export default function ViewMapPage() {
  const { isDark, toggleTheme } = useTheme();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [categoryFilter, statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set('category', categoryFilter);
      if (statusFilter) params.set('status', statusFilter);
      
      const res = await fetch(`/api/reports?${params}`);
      const data = await res.json();
      if (data.success) setReports(data.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapMarkers = reports.map((r) => ({
    position: [r.location.lat, r.location.lng] as [number, number],
    popup: r.title,
    type: 'issue' as const,
  }));

  return (
    <div className="map-page">
      <header className="map-header">
        <div className="header-content">
          <div className="logo">Samadhan Setu - Issues Map</div>
          <button onClick={toggleTheme} className="theme-btn">{isDark ? 'Light' : 'Dark'}</button>
        </div>
      </header>

      <div className="map-container">
        <aside className="sidebar">
          <div className="filter-section">
            <h3>Filter Issues</h3>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              <option value="pothole">Pothole</option>
              <option value="streetlight">Streetlight</option>
              <option value="garbage">Garbage</option>
              <option value="drainage">Drainage</option>
              <option value="water_leak">Water Leak</option>
              <option value="tree_down">Tree Down</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="issues-section">
            <h3>Issues ({reports.length})</h3>
            <div className="issues-list">
              {loading ? (
                <p className="loading">Loading...</p>
              ) : reports.length === 0 ? (
                <p className="empty">No issues found</p>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className={`issue-item ${selectedReport?.id === report.id ? 'selected' : ''}`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="issue-header">
                      <span className="issue-category">{report.category}</span>
                      <span className={`badge badge-${report.status}`}>{report.status}</span>
                    </div>
                    <h4>{report.title}</h4>
                    <p className="issue-address">{report.location.address}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="map-main">
          <LeafletMap
            markers={[
              ...mapMarkers,
              ...(selectedReport ? [{
                position: [selectedReport.location.lat, selectedReport.location.lng] as [number, number],
                popup: selectedReport.title,
                type: 'issue' as const
              }] : [])
            ]}
            center={selectedReport ? [selectedReport.location.lat, selectedReport.location.lng] : [23.2599, 77.4126]}
            zoom={selectedReport ? 15 : 13}
            height="100%"
          />
          
          {selectedReport && (
            <div className="issue-detail-panel">
              <button className="close-btn" onClick={() => setSelectedReport(null)}>X</button>
              <Card report={selectedReport} />
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .map-page { display: flex; flex-direction: column; height: 100vh; background: #f8f9fa; }
        .map-header { background: #1e3a5f; padding: 12px 0; }
        .header-content { display: flex; justify-content: space-between; align-items: center; padding: 0 24px; }
        .logo { color: white; font-weight: 700; }
        .theme-btn { padding: 8px 16px; border-radius: 8px; background: rgba(255,255,255,0.2); color: white; }
        .map-container { display: flex; flex: 1; }
        .sidebar { width: 360px; background: white; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; }
        .filter-section { padding: 20px; border-bottom: 1px solid #e0e0e0; }
        .filter-section h3 { margin-bottom: 16px; color: #333; }
        .filter-section select { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; margin-bottom: 12px; }
        .issues-section { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .issues-section h3 { padding: 16px 20px; border-bottom: 1px solid #e0e0e0; color: #333; }
        .issues-list { flex: 1; overflow-y: auto; padding: 12px; }
        .loading, .empty { padding: 40px; text-align: center; color: #666; }
        .issue-item { padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; margin-bottom: 10px; cursor: pointer; }
        .issue-item:hover { border-color: #3498db; }
        .issue-item.selected { border-color: #3498db; background: #f0f8ff; }
        .issue-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .issue-category { font-size: 11px; text-transform: uppercase; color: #666; font-weight: 600; }
        .issue-item h4 { font-size: 14px; margin-bottom: 6px; color: #333; }
        .issue-address { font-size: 12px; color: #666; }
        .map-main { flex: 1; position: relative; }
        .issue-detail-panel { position: absolute; bottom: 20px; left: 20px; right: 20px; max-width: 400px; background: white; border-radius: 14px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .close-btn { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; border-radius: 50%; background: #eee; }
        @media (max-width: 768px) { .map-container { flex-direction: column; } .sidebar { width: 100%; height: 300px; } }
      `}</style>
    </div>
  );
}