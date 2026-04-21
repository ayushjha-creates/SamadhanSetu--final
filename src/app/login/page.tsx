'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/app/providers';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/citizen');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        router.push('/citizen');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
          {isDark ? '☀️' : '🌙'}
        </button>
        
        <div className="login-header">
          <img src="/logo.png" alt="Samadhan Setu" style={{ height: '60px', borderRadius: '12px' }} />
          <h1>Welcome Back</h1>
          <p>Sign in to continue to Samadhan Setu</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link href="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            {loading ? (
              <span className="spinner" style={{ width: 20, height: 20 }}></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-buttons">
          <button className="btn btn-outline social-btn">
            <span>🔵</span> Continue with Google
          </button>
          <button className="btn btn-outline social-btn">
            <span>🐵</span> Continue with Facebook
          </button>
        </div>

        <p className="signup-link">
          Don't have an account? <Link href="/signup">Create one</Link>
        </p>

        <div className="demo-info">
          <p>Demo Accounts:</p>
          <div className="demo-accounts">
            <span>👤 admin@samadhan.gov / admin123</span>
            <span>👤 official@bhopal.gov / official123</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-blue), var(--dark-navy));
          padding: 24px;
        }
        .login-container {
          background: var(--card-light);
          padding: 48px;
          border-radius: 16px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        [data-theme="dark"] .login-container {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .theme-toggle {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--background-light);
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        [data-theme="dark"] .theme-toggle {
          background: var(--border-dark);
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--primary-blue), var(--dark-navy));
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 20px;
          margin: 0 auto 20px;
        }
        .login-header h1 {
          font-size: 26px;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        [data-theme="dark"] .login-header h1 {
          color: var(--text-light);
        }
        .login-header p {
          color: var(--text-muted);
          font-size: 14px;
        }
        .error-message {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          padding: 14px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }
        [data-theme="dark"] .error-message {
          background: rgba(231, 76, 60, 0.15);
          color: #f87171;
        }
        .password-field {
          position: relative;
        }
        .password-field input {
          padding-right: 50px;
        }
        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 18px;
          padding: 4px;
        }
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .forgot-link {
          font-size: 14px;
          color: var(--primary-blue);
        }
        .btn-full {
          width: 100%;
        }
        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: var(--text-muted);
          font-size: 13px;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-light);
        }
        [data-theme="dark"] .divider::before,
        [data-theme="dark"] .divider::after {
          background: var(--border-dark);
        }
        .divider span {
          padding: 0 16px;
        }
        .social-buttons {
          display: flex;
          gap: 12px;
        }
        .social-btn {
          flex: 1;
          justify-content: center;
          font-size: 13px;
        }
        .signup-link {
          text-align: center;
          margin-top: 24px;
          color: var(--text-muted);
        }
        .signup-link a {
          color: var(--primary-blue);
          font-weight: 600;
        }
        .demo-info {
          margin-top: 24px;
          padding: 16px;
          background: var(--background-light);
          border-radius: 10px;
          font-size: 13px;
        }
        [data-theme="dark"] .demo-info {
          background: var(--border-dark);
        }
        .demo-info p {
          color: var(--text-secondary);
          margin-bottom: 8px;
          font-weight: 600;
        }
        .demo-accounts {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: var(--text-muted);
        }
        .spinner {
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          .login-container {
            padding: 32px 24px;
          }
          .social-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}