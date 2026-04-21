'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  type?: 'citizen' | 'official';
}

export default function Sidebar({ type = 'citizen' }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const citizenLinks = [
    { href: '/citizen', label: 'Dashboard', icon: '🏠' },
    { href: '/citizen/reports', label: 'My Reports', icon: '📋' },
    { href: '/viewmap', label: 'View Map', icon: '🗺️' },
    { href: '/citizen/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { href: '/citizen/rewards', label: 'Rewards', icon: '🎁' },
  ];

  const officialLinks = [
    { href: '/cityofficial', label: 'Dashboard', icon: '🏠' },
    { href: '/cityofficial/reports', label: 'All Issues', icon: '📋' },
    { href: '/cityofficial/map', label: 'Map View', icon: '🗺️' },
    { href: '/cityofficial/analytics', label: 'Analytics', icon: '📊' },
    { href: '/cityofficial/departments', label: 'Departments', icon: '🏢' },
  ];

  const links = type === 'citizen' ? citizenLinks : officialLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-avatar">{user?.full_name?.charAt(0) || 'U'}</div>
        <div className="user-info">
          <span className="user-name">{user?.full_name || 'User'}</span>
          <span className="user-role">{type === 'citizen' ? 'Citizen' : 'Official'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
          >
            <span className="link-icon">{link.icon}</span>
            <span className="link-label">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-emergency">
        <h4>Emergency</h4>
        <div className="emergency-numbers">
          <div className="emergency-item">
            <span>🚔 Police</span>
            <span>100</span>
          </div>
          <div className="emergency-item">
            <span>🚒 Fire</span>
            <span>101</span>
          </div>
          <div className="emergency-item">
            <span>🚑 Ambulance</span>
            <span>102</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: 280px;
          background: linear-gradient(135deg, #1a2a6c, #b21f1f);
          color: white;
          height: 100vh;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 24px;
        }
        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--secondary-green);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
        }
        .user-info {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-weight: 600;
          font-size: 16px;
        }
        .user-role {
          font-size: 12px;
          opacity: 0.7;
        }
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--border-radius);
          color: rgba(255, 255, 255, 0.8);
          transition: all var(--transition-fast);
        }
        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .sidebar-link.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        .link-icon {
          font-size: 18px;
        }
        .link-label {
          font-size: 14px;
          font-weight: 500;
        }
        .sidebar-emergency {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sidebar-emergency h4 {
          font-size: 14px;
          margin-bottom: 12px;
          color: var(--danger-red);
        }
        .emergency-numbers {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .emergency-item {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          opacity: 0.9;
        }
      `}</style>
    </aside>
  );
}