import { useEffect, useState } from 'react'

function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 500) // Wait for fade out animation
    }, 4000) // Disappears after 4 seconds
    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  const bgColor = type === 'success' ? '#6F4E37' : '#e74c3c' // Brown for success, red for error

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: bgColor,
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 9999,
      animation: 'slideInRight 0.4s ease-out',
      maxWidth: '350px',
      borderLeft: '5px solid #F4D03F' // Butter yellow accent
    }}>
      <div style={{ fontSize: '1.5em' }}>
        {type === 'success' ? '✅' : '⚠️'}
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95em' }}>
          {type === 'success' ? 'Request Approved!' : 'Notification'}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.85em', opacity: 0.9 }}>
          {message}
        </p>
      </div>
      <button 
        onClick={() => setVisible(false)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '1.2em',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        ×
      </button>
    </div>
  )
}

export default Toast