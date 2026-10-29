import { useState, useEffect } from 'react'
import axios from 'axios'
import Toast from './Toast'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const [myResources, setMyResources] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [animatedScore, setAnimatedScore] = useState(0)
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' })

  useEffect(() => {
    fetchData()
    const timer = setTimeout(() => setAnimatedScore(user.trustScore), 300)
    return () => clearTimeout(timer)
  }, [user])

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:8000/resources')
      const allResources = res.data
      
      const posted = allResources.filter(r => r.ownerName === user.fullName)
      setMyResources(posted)

      const requested = allResources.filter(r => r.requesterName === user.fullName)
      setMyRequests(requested)

      // Check for student approval notification
      if (user.role === 'student') {
        const approvedItem = requested.find(r => r.status === 'rented')
        if (approvedItem) {
          setToast({ show: true, msg: `Great news! Your request for "${approvedItem.title}" was approved by ${approvedItem.ownerName}. Go pick it up!`, type: 'success' })
        }
      }

      // NEW: Check for owner pickup notification
      if (user.role === 'owner') {
        const pickedUpItem = posted.find(r => r.status === 'picked_up')
        if (pickedUpItem) {
          setToast({ show: true, msg: `🤝 ${pickedUpItem.requesterName} has picked up "${pickedUpItem.title}"!`, type: 'success' })
        }
      }
    } catch (err) { console.error(err) }
  }

  const handleApprove = async (id, title) => {
    try {
      await axios.post(`http://localhost:8000/resources/${id}/approve`)
      setToast({ show: true, msg: `Request for "${title}" approved! The student has been notified.`, type: 'success' })
      fetchData()
    } catch (err) { alert('Error approving') }
  }

  const handleReject = async (id) => {
    if (confirm('Are you sure you want to reject this request?')) {
      await axios.post(`http://localhost:8000/resources/${id}/reject`)
      setToast({ show: true, msg: `Request rejected.`, type: 'success' })
      fetchData()
    }
  }

  const handleComplete = async (id) => {
    try {
      const notes = prompt("📝 Enter condition notes (e.g., 'Perfect condition' or 'Minor wear'):")
      if (notes !== null) {
        const res = await axios.post(`http://localhost:8000/resources/${id}/complete`, { conditionNotes: notes })
        setToast({ show: true, msg: `Item returned! Your Trust Score is now ${res.data.newTrustScore}`, type: 'success' })
        fetchData()
      }
    } catch (err) { alert('Error') }
  }

  const activeRentals = myResources.filter(r => r.status === 'rented' || r.status === 'picked_up').length
  const pendingRequests = myResources.filter(r => r.status === 'pending').length
  const totalShared = myResources.length

  return (
    <div className="dashboard-container">
      {toast.show && <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="dashboard-header">
        <h2 className="dashboard-title">👤 User Dashboard</h2>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="trust-card animate-fade-in">
        <div className="trust-info">
          <h1 className="welcome-text">Welcome, {user.fullName}!</h1>
          <p className="user-details">Role: <span className="role-badge">{user.role}</span> | Email: {user.email}</p>
        </div>
        <div className="trust-score-box">
          <p className="trust-label">Trust Score</p>
          <h1 className="score-number">{animatedScore}</h1>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${animatedScore}%` }}></div></div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}><div className="stat-icon">📦</div><h3 className="stat-number">{totalShared}</h3><p className="stat-label">Items Shared</p></div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}><div className="stat-icon">⏳</div><h3 className="stat-number">{pendingRequests}</h3><p className="stat-label">Pending Approvals</p></div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.3s' }}><div className="stat-icon">🔒</div><h3 className="stat-number">{activeRentals}</h3><p className="stat-label">Active Rentals</p></div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.4s' }}><div className="stat-icon">⭐</div><h3 className="stat-number">{Math.floor(user.trustScore / 5)}</h3><p className="stat-label">Successful Trades</p></div>
      </div>

      {user.role === 'owner' && (
        <div className="resources-section animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="section-title">📦 My Posted Resources</h3>
          {myResources.length === 0 ? <p className="no-resources">No resources posted yet.</p> : (
            <div className="resources-list">
              {myResources.map((res, index) => (
                <div key={res._id} className={`resource-card ${res.status} animate-slide-up`} style={{ animationDelay: `${0.6 + (index * 0.1)}s` }}>
                  <div className="resource-info">
                    <h4 className="resource-title">{res.title}</h4>
                    <div className="status-badge-wrapper">
                      <span className={`status-badge ${res.status}`}>
                        {res.status === 'pending' && '⏳ Pending Approval'}
                        {res.status === 'rented' && '✅ Approved (Ready for pickup)'}
                        {res.status === 'picked_up' && '🤝 Picked Up by Student'}
                        {res.status === 'available' && '✅ Available'}
                      </span>
                    </div>
                    {res.requesterName && <p className="requester-info">👤 Requested by: <strong>{res.requesterName}</strong></p>}
                    {res.status === 'rented' && res.conditionNotes && <p className="condition-note">📝 Return Note: <em>{res.conditionNotes}</em></p>}
                  </div>
                  <div className="resource-actions">
                    {res.status === 'pending' && (<><button onClick={() => handleApprove(res._id, res.title)} className="btn-approve">✓ Approve</button><button onClick={() => handleReject(res._id)} className="btn-reject">✗ Reject</button></>)}
                    {res.status === 'picked_up' && (<button onClick={() => handleComplete(res._id)} className="btn-return"> Mark Returned (+5 Trust)</button>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user.role === 'student' && (
        <div className="resources-section animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="section-title">📋 My Requests</h3>
          {myRequests.length === 0 ? <p className="no-resources">You haven't requested any items yet.</p> : (
            <div className="resources-list">
              {myRequests.map((res, index) => (
                <div key={res._id} className={`resource-card ${res.status} animate-slide-up`} style={{ animationDelay: `${0.6 + (index * 0.1)}s` }}>
                  <div className="resource-info">
                    <h4 className="resource-title">{res.title}</h4>
                    <div className="status-badge-wrapper">
                      <span className={`status-badge ${res.status}`}>
                        {res.status === 'pending' && '⏳ Waiting for Approval'}
                        {res.status === 'rented' && '✅ Approved - Go pick it up!'}
                        {res.status === 'picked_up' && '🤝 You have this item'}
                        {res.status === 'available' && '❌ Rejected'}
                      </span>
                    </div>
                    <p className="requester-info">Shared by: <strong>{res.ownerName}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default Dashboard