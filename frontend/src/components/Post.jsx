import { useState } from 'react'
import axios from 'axios'

function Post({ user, onPosted }) {
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: 'Books', 
    condition: 'Like New',
    image: '' 
  })
  const [msg, setMsg] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  // This function converts your uploaded photo into a code the database can save
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result })
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('https://sharehackathon-sork.vercel.app
/resources', {
        ...form,
        ownerId: user._id || user.id,
        ownerName: user.fullName
      })
      setMsg('✅ Resource posted successfully!')
      setForm({ title: '', description: '', category: 'Books', condition: 'Like New', image: '' })
      setImagePreview('')
      if (onPosted) onPosted()
    } catch (err) { 
      setMsg('❌ Error posting resource') 
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#5D4037' }}>📦 Post a New Resource</h2>
      <div style={{ background: '#FFF8DC', padding: '30px', borderRadius: '12px', border: '2px solid #6F4E37', boxShadow: '0 4px 10px rgba(111, 78, 57, 0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6F4E37' }}>Item Title</label>
            <input 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              required 
              placeholder="e.g., TI-84 Graphing Calculator" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6F4E37' }}>Description</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              required 
              placeholder="Describe the item, its condition, and sharing rules..." 
              rows="4" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontFamily: 'inherit' }} 
            />
          </div>

          {/* NEW: Real Image Upload Button */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6F4E37' }}>Upload Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }} 
            />
            {/* Shows a preview of the image you just picked */}
            {imagePreview && (
              <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6F4E37' }}>Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Tools">Tools</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#6F4E37' }}>Condition</label>
              <select value={form.condition} onChange={e => setForm({...form, condition: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <button type="submit" style={{ padding: '15px', background: 'linear-gradient(135deg, #6F4E37, #8B6F47)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
            Publish Resource
          </button>
          {msg && <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '10px', color: msg.includes('✅') ? '#27ae60' : '#e74c3c' }}>{msg}</p>}
        </form>
      </div>
    </div>
  )
}
export default Post