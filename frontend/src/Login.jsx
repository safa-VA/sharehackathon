import { useState } from 'react'
import axios from 'axios'

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('https://sharehackathon-sork.vercel.app
/login', formData)
      setMessage('✅ ' + res.data.message)
      // Store the token and user info
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      // Call the parent function to switch to dashboard
      if (onLoginSuccess) onLoginSuccess(res.data.user)
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Login failed'))
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>ShareSpace Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
      </form>
      {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  )
}

export default Login