import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <Link to="/" style={styles.logoLink}>
            ⚡ HackMERN
          </Link>
        </div>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          {user && (
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          )}
        </nav>
        <div style={styles.authArea}>
          {user ? (
            <div style={styles.userSection}>
              <span style={styles.userEmail}>{user.email}</span>
              <button onClick={handleLogout} style={styles.buttonLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div style={styles.authLinks}>
              <Link to="/login" style={styles.buttonLink}>Login</Link>
              <Link to="/signup" style={{ ...styles.buttonLink, ...styles.buttonPrimary }}>Signup</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    borderBottom: '1px solid #374151',
    padding: '0.75rem 1.5rem'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.25rem'
  },
  logoLink: {
    color: '#38bdf8',
    textDecoration: 'none'
  },
  nav: {
    display: 'flex',
    gap: '1.25rem'
  },
  navLink: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.95rem'
  },
  authArea: {
    display: 'flex',
    alignItems: 'center'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  userEmail: {
    fontSize: '0.875rem',
    color: '#9ca3af'
  },
  authLinks: {
    display: 'flex',
    gap: '0.5rem'
  },
  buttonLink: {
    padding: '0.4rem 0.85rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: '#f9fafb',
    backgroundColor: '#374151'
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
    color: '#ffffff'
  },
  buttonLogout: {
    padding: '0.4rem 0.85rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none'
  }
};

export default Header;

