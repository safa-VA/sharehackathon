import { useState } from 'react'
import Register from './Register'
import Login from './Login'
import Browse from './components/Browse'
import Post from './components/Post'
import Dashboard from './components/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  
  // FIX: Load user from localStorage on startup so you don't get logged out!
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    localStorage.setItem('user', JSON.stringify(user)); // Save to storage
    setCurrentPage('dashboard');
  }

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('pendingRequests'); // Clear pending requests on logout
    setCurrentPage('login');
  }

  if (loggedInUser) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', background: '#FFF8DC', minHeight: '100vh' }}>
        {/* Top Navigation Bar */}
        <nav style={{ background: 'white', padding: '15px 30px', boxShadow: '0 2px 10px rgba(111, 78, 57, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #F4D03F' }}>
          <h2 style={{ margin: 0, color: '#6F4E37', cursor: 'pointer' }} onClick={() => setCurrentPage('browse')}>🤝 ShareSpace</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <NavBtn active={currentPage === 'browse'} onClick={() => setCurrentPage('browse')}>Browse</NavBtn>
            {loggedInUser.role === 'owner' && <NavBtn active={currentPage === 'post'} onClick={() => setCurrentPage('post')}>Post Item</NavBtn>}
            <NavBtn active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')}>Dashboard</NavBtn>
          </div>
        </nav>

        {/* Main Content Area */}
        <div style={{ padding: '20px' }}>
          {currentPage === 'browse' && <Browse user={loggedInUser} />}
          {currentPage === 'post' && <Post user={loggedInUser} onPosted={() => setCurrentPage('browse')} />}
          {currentPage === 'dashboard' && <Dashboard user={loggedInUser} onLogout={handleLogout} />}
        </div>
      </div>
    )
  }

  // If not logged in, show auth pages
  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: '50px', background: '#FFF8DC', minHeight: '100vh', padding: '50px' }}>
      <h1 style={{ color: '#6F4E37', fontSize: '3em' }}>🤝 ShareSpace</h1>
      <p style={{ color: '#8B6F47', marginBottom: '30px' }}>Share resources, build trust.</p>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setCurrentPage('register')} style={authBtn(currentPage === 'register')}>Register</button>
        <button onClick={() => setCurrentPage('login')} style={authBtn(currentPage === 'login')}>Login</button>
      </div>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {currentPage === 'register' && <Register />}
        {currentPage === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      </div>
    </div>
  )
}

function NavBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ 
      padding: '10px 20px', 
      background: active ? '#6F4E37' : '#F4D03F', 
      color: active ? 'white' : '#5D4037', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(111, 78, 57, 0.2)',
      transition: 'all 0.3s ease'
    }}>
      {children}
    </button>
  )
}

const authBtn = (isActive) => ({
  padding: '12px 24px', 
  margin: '0 5px', 
  background: isActive ? '#6F4E37' : '#F4D03F', 
  color: isActive ? 'white' : '#5D4037', 
  border: 'none', 
  borderRadius: '8px', 
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: isActive ? '0 4px 8px rgba(111, 78, 57, 0.3)' : '0 4px 8px rgba(244, 208, 63, 0.3)',
  transition: 'all 0.3s ease'
})

export default App