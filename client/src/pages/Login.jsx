import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/validation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign In</h2>
        <p style={styles.subtitle}>Enter your email and password to access your account</p>

        {!isConfigured && (
          <div style={styles.warningBox}>
            <strong>Notice:</strong> Supabase Auth keys are not yet configured in <code>client/.env</code>.
          </div>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.submitButton, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.switchAuth}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '420px',
    margin: '3rem auto',
    padding: '0 1rem'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.5rem',
    color: '#0f172a',
    textAlign: 'center'
  },
  subtitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '0.875rem',
    color: '#64748b',
    textAlign: 'center'
  },
  warningBox: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fef3c7',
    color: '#92400e',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.85rem'
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#b91c1c',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.85rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#334155'
  },
  input: {
    padding: '0.65rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem'
  },
  submitButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '6px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  switchAuth: {
    marginTop: '1.5rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    color: '#64748b'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500'
  }
};

export default Login;
