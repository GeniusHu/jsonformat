import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { toggleTheme } = useTheme()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'JSON Tools' },
    { path: '/converter', label: 'Converters' },
    { path: '/escape', label: 'Escape' }
  ]

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <Link to="/">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4C6.34315 4 5 5.34315 5 7V8C5 9.10457 4.10457 10 3 10V14C4.10457 14 5 14.8954 5 16V17C5 18.6569 6.34315 20 8 20" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 4C17.6569 4 19 5.34315 19 7V8C19 9.10457 19.8954 10 21 10V14C19.8954 14 19 14.8954 19 16V17C19 18.6569 17.6569 20 16 20" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="logo-text">JSON Tools</span>
          </Link>
        </div>
        <div className="nav-tabs">
          {navItems.map(item => (
            <Link 
              to={item.path} 
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}