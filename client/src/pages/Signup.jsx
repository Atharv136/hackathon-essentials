import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail, isValidPassword } from '../utils/validation';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password, 6)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await signUp({ email: email.trim(), password });
      // If Supabase has email confirmation enabled
      if (data?.user && !data.session) {
        setSuccessMessage('Account created! Please check your email inbox to verify your account before logging in.');
      } else {
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to create an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>
        <p style={styles.subtitle}>Sign up to get started with the MERN starter</p>

        {!isConfigured && (
          <div style={styles.warningBox}>
            <strong>Notice:</strong> Supabase Auth keys are not yet configured in <code>client/.env</code>.
          </div>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

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
              placeholder="At least 6 characters"
              disabled={loading}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchAuth}>
          Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
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
  successBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#15803d',
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

export default Signup;
