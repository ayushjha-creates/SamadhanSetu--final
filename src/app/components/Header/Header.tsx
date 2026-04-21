'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/app/providers';

export default function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <img src="/logo.png" alt="Samadhan Setu" className="logo-img" />
          <span className="logo-text">Samadhan Setu</span>
        </Link>

        <nav className="nav-links">
          <Link href="/home" className="nav-link">Home</Link>
          <Link href="/viewmap" className="nav-link">Map</Link>
          <Link href="/donation" className="nav-link">Donate</Link>
          <Link href="/ecovoice" className="nav-link">EcoVoice</Link>
        </nav>

        <div className="header-actions">
          <button onClick={toggleTheme} className="btn btn-ghost theme-toggle" aria-label="Toggle theme">
            {isDark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.full_name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link href="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link href="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #1e3a5f, #0d1b2a);
          padding: 14px 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-weight: 700;
          font-size: 20px;
        }
        .logo-img {
          height: 40px;
          width: auto;
          border-radius: 8px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3498db, #2ecc71);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }
        .nav-links {
          display: flex;
          gap: 28px;
        }
        .nav-link {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          transition: color 0.2s;
          position: relative;
        }
        .nav-link:hover {
          color: white;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #2ecc71;
          transition: width 0.2s;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .theme-toggle {
          font-size: 18px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          padding: 0;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-name {
          color: white;
          font-weight: 500;
        }
        .auth-buttons {
          display: flex;
          gap: 10px;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .logo-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}