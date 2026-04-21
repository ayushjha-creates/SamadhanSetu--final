'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/app/providers';

export default function SignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    username: '',
    phone: '',
    birthdate: '',
    how_heard: '',
    terms_accepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/citizen');
    }
  }, [user, router]);

  const getPasswordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 6) strength++;
    if (formData.password.length >= 10) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      if (step === 1) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (passwordStrength < 2) {
          setError('Password must be at least 6 characters');
          return;
        }
      }
      setStep(step + 1);
      setError('');
      return;
    }

    if (!formData.terms_accepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signup(formData);
      if (result.success) {
        router.push('/citizen');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
          {isDark ? '☀️' : '🌙'}
        </button>
        
        <div className="signup-header">
          <img src="/logo.png" alt="Samadhan Setu" style={{ height: '60px', borderRadius: '12px' }} />
          <h1>Create Account</h1>
          <p>Join Samadhan Setu and make a difference</p>
        </div>

        <div className="progress-bar">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`progress-item ${step >= s ? 'active' : ''}`}>
              <div className="progress-step">{s}</div>
              <span className="progress-label">
                {s === 1 ? 'Account' : s === 2 ? 'Profile' : 'Complete'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          {step === 1 && (
            <div className="form-step">
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
                  required
                />
                <div className="password-strength">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className={`strength-bar ${i <= passwordStrength ? 'active' : ''}`}
                      style={{ 
                        backgroundColor: i <= passwordStrength ? strengthColors[passwordStrength - 1] : undefined 
                      }}
                    />
                  ))}
                </div>
                <span className="strength-text" style={{ color: strengthColors[passwordStrength - 1] || '#999' }}>
                  {passwordStrength === 0 ? '' : passwordStrength < 3 ? 'Weak' : passwordStrength < 5 ? 'Good' : 'Strong'}
                </span>
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choose a unique username"
                  required
                />
              </div>
              <div className="input-group">
                <label>Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Your phone number"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <div className="input-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>How did you hear about us?</label>
                <select 
                  value={formData.how_heard} 
                  onChange={(e) => setFormData({ ...formData, how_heard: e.target.value })}
                >
                  <option value="">Select an option</option>
                  <option value="social_media">Social Media</option>
                  <option value="friend">Friend/Family</option>
                  <option value="news">News Article</option>
                  <option value="search">Search Engine</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.terms_accepted}
                    onChange={(e) => setFormData({ ...formData, terms_accepted: e.target.checked })}
                  />
                  <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
                </label>
              </div>
            </div>
          )}

          <div className="form-buttons">
            {step > 1 && (
              <button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20 }}></span> : step === 3 ? 'Create Account' : 'Continue'}
            </button>
          </div>
        </form>

        <p className="login-link">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>

      <style jsx>{`
        .signup-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-blue), var(--dark-navy));
          padding: 24px;
        }
        .signup-container {
          background: var(--card-light);
          padding: 40px;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        [data-theme="dark"] .signup-container {
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
        .signup-header {
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
        .signup-header h1 {
          font-size: 24px;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        [data-theme="dark"] .signup-header h1 {
          color: var(--text-light);
        }
        .signup-header p {
          color: var(--text-muted);
          font-size: 14px;
        }
        .progress-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
          position: relative;
        }
        .progress-bar::before {
          content: '';
          position: absolute;
          top: 16px;
          left: 15%;
          right: 15%;
          height: 2px;
          background: var(--border-light);
        }
        [data-theme="dark"] .progress-bar::before {
          background: var(--border-dark);
        }
        .progress-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
        }
        .progress-step {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }
        [data-theme="dark"] .progress-step {
          background: var(--border-dark);
        }
        .progress-item.active .progress-step {
          background: var(--primary-blue);
          color: white;
        }
        .progress-label {
          font-size: 12px;
          color: var(--text-muted);
        }
        .progress-item.active .progress-label {
          color: var(--primary-blue);
        }
        .error-message {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          text-align: center;
        }
        [data-theme="dark"] .error-message {
          background: rgba(231, 76, 60, 0.15);
          color: #f87171;
        }
        .password-strength {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }
        .strength-bar {
          height: 4px;
          flex: 1;
          background: var(--border-light);
          border-radius: 2px;
          transition: background 0.3s ease;
        }
        .strength-text {
          font-size: 12px;
          margin-top: 4px;
        }
        .checkbox-group label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
        }
        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
        }
        .checkbox-group a {
          color: var(--primary-blue);
        }
        .form-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .btn-full {
          flex: 1;
        }
        .login-link {
          text-align: center;
          margin-top: 24px;
          color: var(--text-muted);
        }
        .login-link a {
          color: var(--primary-blue);
          font-weight: 600;
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
      `}</style>
    </div>
  );
}