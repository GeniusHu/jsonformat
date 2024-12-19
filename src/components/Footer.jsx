import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="https://github.com/your-repo">GitHub</a>
          <a href="/feedback">Feedback</a>
        </div>
        <div className="footer-right">
          <span className="version">v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}