'use client';

import dynamic from 'next/dynamic';
import ReportModal from '../ReportModal/ReportModal';
import Card from '../Card/Card';
import { Report } from '@/types';

const LeafletMap = dynamic(() => import('../LeafletMap/LeafletMap'), { ssr: false });

interface SamadhanSetuPageProps {
  reports: Report[];
  onSubmitReport: (data: any) => Promise<void>;
}

export default function SamadhanSetuPage({ reports, onSubmitReport }: SamadhanSetuPageProps) {
  const mapMarkers = reports.map((r) => ({
    position: [r.location.lat, r.location.lng] as [number, number],
    popup: r.title,
    type: 'issue' as const,
  }));

  return (
    <div className="page-content">
      <section className="hero">
        <div className="container">
          <h1>Together We Build<br/>A Better Bhopal</h1>
          <p>Report civic issues, track their resolution, and make your city better.</p>
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <LeafletMap markers={mapMarkers} height="500px" />
        </div>
      </section>

      <section className="reports-section">
        <div className="container">
          <h2>Recent Reports</h2>
          <div className="reports-grid">
            {reports.slice(0, 6).map((report) => (
              <Card key={report.id} report={report} />
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, rgba(52, 152, 219, 0.9), rgba(44, 62, 80, 0.9));
          padding: 80px 0;
          text-align: center;
          color: white;
        }
        .hero h1 { font-size: 48px; margin-bottom: 16px; }
        .hero p { font-size: 20px; opacity: 0.9; }
        .map-section, .reports-section { padding: 48px 0; }
        .reports-section h2 { margin-bottom: 32px; font-size: 32px; }
        .reports-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 900px) { .reports-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .reports-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 32px; } }
      `}</style>
    </div>
  );
}