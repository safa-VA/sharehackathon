import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // FIXED: Added closing quote and parenthesis
            const res = await axios.post('https://sharehackathon-sork.vercel.app/register', formData);
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error registering');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="fullName" 
                    placeholder="Full Name" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                >
                    <option value="student">Student</option>
                    <option value="owner">Owner</option>
                </select>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;