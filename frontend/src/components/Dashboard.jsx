import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            // FIXED: Added closing quote and parenthesis
            const res = await axios.get('https://sharehackathon-sork.vercel.app/resources');
            setResources(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching resources:", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading resources...</div>;

    return (
        <div className="dashboard-container">
            <h1>ShareSpace Resources</h1>
            <div className="resources-grid">
                {resources.map((resource) => (
                    <div key={resource._id} className="resource-card">
                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>
                        <span className={`status ${resource.status}`}>{resource.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;