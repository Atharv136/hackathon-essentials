import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          &copy; {new Date().getFullYear()} MERN Hackathon Starter. Built with Vite, React, Express & MongoDB.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#111827',
    color: '#9ca3af',
    borderTop: '1px solid #1f2937',
    padding: '1.25rem 1.5rem',
    marginTop: 'auto',
    textAlign: 'center'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  text: {
    margin: 0,
    fontSize: '0.875rem'
  }
};

export default Footer;

