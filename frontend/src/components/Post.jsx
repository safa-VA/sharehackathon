import React, { useState } from 'react';
import axios from 'axios';

const Post = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        condition: 'Good',
        image: ''
    });
    const [message, setMessage] = useState('');
    
    // Get the currently logged-in user from local storage
    const user = JSON.parse(localStorage.getItem('user')); 

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setMessage('Please log in to post a resource.');
            return;
        }

        try {
            // FIXED: Added closing quote and parenthesis
            const res = await axios.post('https://sharehackathon-sork.vercel.app/resources', {
                ...formData,
                ownerId: user._id,
                ownerName: user.fullName
            });
            setMessage(res.data.message);
            // Clear the form after successful post
            setFormData({ title: '', description: '', category: '', condition: 'Good', image: '' });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error posting resource');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Post a Resource</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="title" 
                    placeholder="Title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <textarea 
                    name="description" 
                    placeholder="Description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="text" 
                    name="category" 
                    placeholder="Category (e.g., Electronics, Books)" 
                    value={formData.category} 
                    onChange={handleChange} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <select 
                    name="condition" 
                    value={formData.condition} 
                    onChange={handleChange} 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="New">New</option>
                </select>
                <input 
                    type="text" 
                    name="image" 
                    placeholder="Image URL (optional)" 
                    value={formData.image} 
                    onChange={handleChange} 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Post Resource</button>
            </form>
            {message && <p style={{ marginTop: '10px' }}>{message}</p>}
        </div>
    );
};

export default Post;