// src/components/APITest.jsx
import React, { useState } from 'react';
import { testConnection } from '../api/api';

const APITest = () => {
    const [status, setStatus] = useState('Not tested');
    const [error, setError] = useState('');

    const testAPI = async () => {
        setStatus('Testing...');
        const connected = await testConnection();
        if (connected) {
            setStatus('Connected successfully!');
            setError('');
        } else {
            setStatus('Connection failed');
            setError('Unable to connect to backend. Make sure the server is running on http://localhost:8000');
        }
    };

    return (
        <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc' }}>
            <h3>API Connection Test</h3>
            <button onClick={testAPI}>Test Connection</button>
            <p>Status: {status}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default APITest;