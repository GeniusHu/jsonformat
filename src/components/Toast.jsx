import { useEffect } from 'react'
import '../styles/Toast.css'

export default function Toast({ message, type, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [show, message])
  
  if (!show) return null
  
  return (
    <div className={`toast ${type}`}>
      <div className="toast-message">{message}</div>
    </div>
  )
} 