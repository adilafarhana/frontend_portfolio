const Footer = ({ accentColor }) => {
  return (
    <footer style={{ textAlign: 'center', padding: '30px 20px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
      <h3 style={{ color: accentColor || 'var(--accent-purple)' }}>Adila Farhana</h3>
      <p style={{ color: 'var(--text-muted)' }}>Full Stack Developer | PHP Laravel | React</p>
      <p className="footer-copy" style={{ color: 'var(--text-dim)', marginTop: '8px' }}>
        © {new Date().getFullYear()} All rights reserved. • <a href="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Admin Portal</a>
      </p>
    </footer>
  );
};

export default Footer;