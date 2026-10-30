import { useState } from 'react'
import axios from 'axios'

function Register() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'student' })
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('https://sharehackathon-sork.vercel.app
/register', formData)
      setMessage('✅ ' + res.data.message)
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Error'))
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>ShareSpace Register</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required style={{ padding: '10px' }} />
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{ padding: '10px' }} />
        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ padding: '10px' }}>
          <option value="student">Student</option>
          <option value="owner">Owner</option>
        </select>
        <button type="submit" style={{ padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Register</button>
      </form>
      {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  )
}

export default Register