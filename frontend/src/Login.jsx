import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // FIXED: Added closing quote and parenthesis
            const res = await axios.post('https://sharehackathon-sork.vercel.app/login', { email, password });
            setMessage(res.data.message);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error logging in');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;