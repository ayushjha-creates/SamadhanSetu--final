'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/app/providers';

export default function AdminSignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    department: '',
    employee_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/cityofficial');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          role: 'cityofficial',
          username: formData.employee_id 
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/cityofficial');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred');
    }
    setLoading(false);
  };

  const departments = [
    { value: 'public_works', label: 'Public Works Department' },
    { value: 'sanitation', label: 'Sanitation & Cleaning' },
    { value: 'water', label: 'Water Supply' },
    { value: 'electricity', label: 'Electricity & Streetlights' },
    { value: 'parks', label: 'Parks & Gardens' },
    { value: 'roads', label: 'Roads & Transport' },
    { value: 'health', label: 'Health & Sanitation' },
  ];

  return (
    <div className="admin-page">
      <button onClick={toggleTheme} className="theme-toggle">{isDark ? '☀️' : '🌙'}</button>
      
      <div className="signup-container">
        <div className="signup-header">
          <div className="logo-icon">🏛️</div>
          <h1>City Official Registration</h1>
          <p>Register as a government official to manage civic issues</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Your official name"
              required
            />
          </div>

          <div className="input-group">
            <label>Official Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@bhopal.gov.in"
              required
            />
          </div>

          <div className="input-group">
            <label>Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Employee ID</label>
            <input
              type="text"
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              placeholder="BMC-XXXXX"
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
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            {loading ? '⏳ Registering...' : '🏛️ Register as Official'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e3a5f, #0d1b2a);
          padding: 24px;
        }
        .theme-toggle {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          font-size: 20px;
        }
        .signup-container {
          background: var(--card-light);
          padding: 48px;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        [data-theme="dark"] .signup-container {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .signup-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }
        .signup-header h1 {
          font-size: 26px;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        [data-theme="dark"] .signup-header h1 { color: var(--text-light); }
        .signup-header p {
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
        .btn-full {
          width: 100%;
          margin-top: 8px;
        }
        .login-link {
          text-align: center;
          margin-top: 24px;
          color: var(--text-muted);
        }
        .login-link a {
          color: #3498db;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}