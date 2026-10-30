import { useState, useEffect } from 'react'
import axios from 'axios'
import Toast from './Toast'

function Browse({ user }) {
  const [resources, setResources] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const res = await axios.get('https://sharehackathon-sork.vercel.app
/resources')
      setResources(res.data)
    } catch (err) { console.error(err) }
  }

  const handleRequest = async (id, title) => {
    try {
      await axios.post(`https://sharehackathon-sork.vercel.app
/resources/${id}/request`, { 
        requesterName: user.fullName, 
        requesterId: user._id || user.id 
      })
      alert('✅ Request sent successfully! Waiting for owner approval.')
      fetchResources()
    } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Error')) }
  }

  // NEW: Student Check-in function
  const handleCheckIn = async (id, title, ownerName) => {
    try {
      await axios.post(`https://sharehackathon-sork.vercel.app
/resources/${id}/checkin`)
      alert(`✅ You confirmed you picked up "${title}"! The owner has been notified.`)
      fetchResources()
    } catch (err) { alert('❌ Error checking in') }
  }

  const filtered = resources.filter(r => 
    (filter === 'All' || r.category === filter) && 
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '20px' }}>
      {showToast && <Toast message={toastMsg} type="success" onClose={() => setShowToast(false)} />}

      <h2 style={{ marginBottom: '20px', color: '#6F4E37' }}>🔍 Browse Resources</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <option value="All">All Categories</option>
          <option value="Books">Books</option>
          <option value="Electronics">Electronics</option>
          <option value="Tools">Tools</option>
          <option value="Furniture">Furniture</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {filtered.map(res => (
          <div key={res._id} style={{ border: '2px solid #e1e4e8', borderRadius: '12px', overflow: 'hidden', background: 'white', boxShadow: '0 4px 12px rgba(111, 78, 57, 0.1)' }}>
            {res.image && res.image.trim() !== '' ? (
              <div style={{ width: '100%', height: '220px', background: '#f0f0f0', overflow: 'hidden' }}>
                <img src={res.image} alt={res.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ width: '100%', height: '220px', background: 'linear-gradient(135deg, #F4D03F, #6F4E37)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4em' }}>📦</div>
            )}

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ background: '#6F4E37', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold' }}>{res.category}</span>
                <span style={{ color: res.status === 'rented' ? '#f39c12' : (res.status === 'picked_up' ? '#3498db' : (res.status === 'pending' ? '#f39c12' : '#27ae60')), fontWeight: 'bold', fontSize: '0.9em', textTransform: 'uppercase' }}>
                  {res.status === 'rented' ? '✅ Approved' : (res.status === 'picked_up' ? '🤝 Picked Up' : (res.status === 'pending' ? '⏳ Pending' : '✅ Available'))}
                </span>
              </div>
              
              <h3 style={{ margin: '10px 0', color: '#5D4037', fontSize: '1.3em' }}>{res.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px', lineHeight: '1.5' }}>{res.description}</p>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85em', color: '#8B6F47' }}>👤 {res.ownerName}</span>
                {res.condition && <span style={{ fontSize: '0.8em', color: '#6F4E37', background: '#FFF8DC', padding: '3px 8px', borderRadius: '4px' }}>{res.condition}</span>}
              </div>
              
              {user.role === 'student' && res.status === 'available' && (
                <button onClick={() => handleRequest(res._id, res.title)} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #6F4E37, #8B6F47)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em' }}>Request Item</button>
              )}

              {/* NEW: Student Check-in Button */}
              {user.role === 'student' && res.status === 'rented' && res.requesterName === user.fullName && (
                <button onClick={() => handleCheckIn(res._id, res.title, res.ownerName)} style={{ width: '100%', padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em' }}>
                  ✅ OK, I picked it up!
                </button>
              )}

              {res.status === 'picked_up' && res.requesterName === user.fullName && (
                <div style={{ padding: '10px', background: '#D4EDDA', borderRadius: '8px', textAlign: 'center', color: '#155724', fontWeight: 'bold' }}>
                  🤝 You have this item. Please return it on time!
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Browse