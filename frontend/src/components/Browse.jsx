import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Browse = () => {
    const [resources, setResources] = useState([]);
    // Get the currently logged-in user from local storage
    const user = JSON.parse(localStorage.getItem('user')); 

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            // FIXED URL 1
            const res = await axios.get('https://sharehackathon-sork.vercel.app/resources');
            setResources(res.data);
        } catch (error) {
            console.error("Error fetching resources:", error);
        }
    };

    const handleRequest = async (id) => {
        try {
            // FIXED URL 2
            await axios.post(`https://sharehackathon-sork.vercel.app/resources/${id}/request`, {
                requesterName: user?.fullName,
                requesterId: user?._id
            });
            alert('Request sent successfully!');
            fetchResources();
        } catch (error) {
            alert(error.response?.data?.message || 'Error requesting item');
        }
    };

    const handleApprove = async (id) => {
        try {
            // FIXED URL 3
            await axios.post(`https://sharehackathon-sork.vercel.app/resources/${id}/approve`);
            alert('Request approved!');
            fetchResources();
        } catch (error) {
            alert('Error approving request');
        }
    };

    const handleCheckIn = async (id) => {
        try {
            await axios.post(`https://sharehackathon-sork.vercel.app/resources/${id}/checkin`);
            alert('Check-in successful! Owner notified.');
            fetchResources();
        } catch (error) {
            alert('Error checking in');
        }
    };

    const handleComplete = async (id) => {
        try {
            await axios.post(`https://sharehackathon-sork.vercel.app/resources/${id}/complete`, { 
                conditionNotes: 'Returned in good condition' 
            });
            alert('Transaction complete! Trust score updated.');
            fetchResources();
        } catch (error) {
            alert('Error completing transaction');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Browse Resources</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {resources.map((res) => (
                    <div key={res._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3>{res.title}</h3>
                        <p>{res.description}</p>
                        <p><strong>Category:</strong> {res.category}</p>
                        <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: res.status === 'available' ? 'green' : 'orange' }}>{res.status}</span></p>
                        <p><strong>Owner:</strong> {res.ownerName}</p>
                        
                        {/* Action Buttons based on status and user role */}
                        {res.status === 'available' && user?.role === 'student' && (
                            <button onClick={() => handleRequest(res._id)} style={{ padding: '8px', cursor: 'pointer', width: '100%' }}>Request Item</button>
                        )}
                        
                        {res.status === 'pending' && user?._id === res.ownerId && (
                            <button onClick={() => handleApprove(res._id)} style={{ padding: '8px', cursor: 'pointer', width: '100%', backgroundColor: '#4CAF50', color: 'white' }}>Approve Request</button>
                        )}

                        {res.status === 'rented' && user?._id === res.requesterId && (
                            <button onClick={() => handleCheckIn(res._id)} style={{ padding: '8px', cursor: 'pointer', width: '100%' }}>Check In (Pick Up)</button>
                        )}

                        {res.status === 'picked_up' && user?._id === res.ownerId && (
                            <button onClick={() => handleComplete(res._id)} style={{ padding: '8px', cursor: 'pointer', width: '100%', backgroundColor: '#2196F3', color: 'white' }}>Mark as Returned</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Browse;