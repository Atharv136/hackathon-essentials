import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🛡️ Protected Dashboard</h2>
        <p style={styles.subtext}>
          You can only view this page because you are authenticated.
        </p>

        <div style={styles.infoBox}>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Last Sign In:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '0 1rem'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '2rem'
  },
  heading: {
    margin: '0 0 0.5rem 0',
    color: '#0f172a'
  },
  subtext: {
    color: '#64748b',
    marginBottom: '1.5rem'
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '1rem',
    fontSize: '0.95rem',
    color: '#334155',
    lineHeight: '1.6'
  }
};

export default Dashboard;
