'use client';

import { Report, ReportStatus } from '@/types';

interface CardProps {
  report: Report;
  onUpvote?: () => void;
  showActions?: boolean;
  onStatusChange?: (status: ReportStatus) => void;
}

export default function Card({ report, onUpvote, showActions, onStatusChange }: CardProps) {
  const statusLabels: Record<ReportStatus, string> = {
    new: 'New',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
  };

  const categoryIcons: Record<string, string> = {
    pothole: '🕳️',
    streetlight: '💡',
    garbage: '🗑️',
    drainage: '🚰',
    water_leak: '💧',
    broken_sign: '🚧',
    tree_down: '🌳',
    other: '📍',
  };

  return (
    <div className="card report-card">
      {report.image_url && (
        <div className="card-image">
          <img src={report.image_url} alt={report.title} />
        </div>
      )}
      <div className="card-header">
        <span className="category-icon">{categoryIcons[report.category] || '📍'}</span>
        <span className={`badge badge-${report.status}`}>{statusLabels[report.status]}</span>
        <span className={`badge badge-${report.priority}`}>{report.priority}</span>
      </div>
      <h3 className="card-title">{report.title}</h3>
      <p className="card-description">{report.description}</p>
      <div className="card-location">
        <span>📍</span> {report.location.address}
      </div>
      <div className="card-footer">
        <button onClick={onUpvote} className="upvote-btn">
          👍 {report.upvotes}
        </button>
        <span className="card-date">{new Date(report.created_at).toLocaleDateString()}</span>
      </div>
      {showActions && onStatusChange && (
        <div className="card-actions">
          {(['in_progress', 'resolved', 'closed'] as ReportStatus[]).map((status) => (
            <button key={status} onClick={() => onStatusChange(status)} className="action-btn">
              Mark {statusLabels[status]}
            </button>
          ))}
        </div>
      )}
      <style jsx>{`
        .report-card {
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 16px;
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .report-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 51, 102, 0.2) !important;
        }
        .card-image {
          height: 140px;
          overflow: hidden;
          margin: -1px -1px 0 -1px;
          transition: transform 0.4s ease;
        }
        .report-card:hover .card-image {
          transform: scale(1.08);
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-content {
          padding: 20px;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          padding: 0 20px;
        }
        .category-icon {
          font-size: 22px;
        }
        .badge {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge-new { background: #fef3c7; color: #92400e; }
        .badge-in_progress { background: #bfdbfe; color: #1e40af; }
        .badge-resolved { background: #bbf7d0; color: #166534; }
        .badge-rejected { background: #fecaca; color: #991b1b; }
        .badge-low { background: #d1fae5; color: #065f46; }
        .badge-medium { background: #fef3c7; color: #92400e; }
        .badge-high { background: #fee2e2; color: #991b1b; }
        .badge-critical { background: #991b1b; color: white; }
        .card-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1e3a5f;
          padding: 0 20px;
        }
        .card-description {
          font-size: 13px;
          color: #475569;
          margin-bottom: 10px;
          line-height: 1.5;
          padding: 0 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-location {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 14px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-top: 1px solid #f0f0f0;
        }
        .upvote-btn {
          background: transparent;
          border: none;
          color: #3498db;
          font-weight: 600;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .upvote-btn:hover {
          background: #f0f8ff;
          transform: scale(1.05);
        }
        .card-date {
          font-size: 12px;
          color: #999;
        }
        .card-actions {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          border-top: 1px solid #f0f0f0;
        }
        .action-btn {
          flex: 1;
          padding: 8px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover {
          background: #3498db;
          color: white;
          border-color: #3498db;
        }
      `}</style>
    </div>
  );
}