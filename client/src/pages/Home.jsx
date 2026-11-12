import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Home = () => {
  const { user, isConfigured } = useAuth();
  const [backendStatus, setBackendStatus] = useState({ loading: true, status: null, error: null });

  useEffect(() => {
    api.get('/health')
      .then((res) => {
        setBackendStatus({ loading: false, status: res.data, error: null });
      })
      .catch((err) => {
        setBackendStatus({ loading: false, status: null, error: err.message });
      });
  }, []);

  return (
    <div style={styles.container}>
      {/* Configuration notice if Supabase is unconfigured */}
      {!isConfigured && (
        <div style={styles.alertWarning}>
          <strong>Configuration Notice:</strong> Supabase credentials are not set in <code>client/.env</code>.
          Auth actions will be disabled until you provide your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
        </div>
      )}

      <section style={styles.hero}>
        <h1 style={styles.title}>🚀 MERN Stack Hackathon Skeleton</h1>
        <p style={styles.subtitle}>
          Vite + React 19 Frontend &bull; Express + Node.js Backend &bull; Supabase Auth &bull; Mongoose &bull; AI Service Stubs
        </p>

        {user ? (
          <div style={styles.welcomeCard}>
            <p style={styles.welcomeText}>
              Welcome back, <strong>{user.email}</strong>! You are signed in.
            </p>
            <Link to="/dashboard" style={styles.buttonPrimary}>Go to Protected Dashboard</Link>
          </div>
        ) : (
          <div style={styles.ctaButtons}>
            <Link to="/login" style={styles.buttonPrimary}>Log In</Link>
            <Link to="/signup" style={styles.buttonSecondary}>Create Account</Link>
          </div>
        )}
      </section>

      <section style={styles.statusSection}>
        <h2 style={styles.sectionHeading}>System Status & Integration Health</h2>
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h3>Backend Server</h3>
            {backendStatus.loading && <p style={styles.loadingText}>Pinging /api/health...</p>}
            {backendStatus.status && (
              <div style={styles.badgeSuccess}>
                ✓ Online (Uptime: {Math.round(backendStatus.status.uptime || 0)}s)
              </div>
            )}
            {backendStatus.error && (
              <div style={styles.badgeDanger}>
                ✗ Offline ({backendStatus.error})
              </div>
            )}
          </div>

          <div style={styles.card}>
            <h3>Supabase Auth</h3>
            {isConfigured ? (
              <div style={styles.badgeSuccess}>✓ Configured</div>
            ) : (
              <div style={styles.badgeWarning}>⚠ Missing credentials</div>
            )}
          </div>

          <div style={styles.card}>
            <h3>Backend Services</h3>
            <ul style={styles.serviceList}>
              <li>Gemini AI: <em>Stub ready</em></li>
              <li>Higgsfield: <em>Stub ready</em></li>
              <li>WhatsApp Bot: <em>Stub ready</em></li>
              <li>MongoDB: <em>Mongoose ready</em></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '0 1rem'
  },
  alertWarning: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fef3c7',
    borderLeft: '4px solid #f59e0b',
    color: '#92400e',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem'
  },
  hero: {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2.25rem',
    margin: '0 0 1rem 0',
    color: '#0f172a'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    margin: '0 0 2rem 0',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  welcomeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  welcomeText: {
    fontSize: '1.1rem',
    color: '#1e293b'
  },
  ctaButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem'
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.65rem 1.25rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500'
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
    padding: '0.65rem 1.25rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500'
  },
  statusSection: {
    marginTop: '2rem'
  },
  sectionHeading: {
    fontSize: '1.35rem',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '1.25rem'
  },
  loadingText: {
    color: '#64748b'
  },
  badgeSuccess: {
    color: '#16a34a',
    fontWeight: 'bold',
    marginTop: '0.5rem'
  },
  badgeDanger: {
    color: '#dc2626',
    fontWeight: 'bold',
    marginTop: '0.5rem'
  },
  badgeWarning: {
    color: '#d97706',
    fontWeight: 'bold',
    marginTop: '0.5rem'
  },
  serviceList: {
    margin: '0.5rem 0 0 0',
    paddingLeft: '1.25rem',
    color: '#475569'
  }
};

export default Home;

