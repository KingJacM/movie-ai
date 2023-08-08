import React from 'react';

const OfflineBanner = () => {
    return (
        <div style={{
            background: '#e74c3c', // Red background
            color: 'white', // White text
            padding: '10px',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            zIndex: '1000',
            textAlign: 'center',
        }}>
            You are currently offline. Some features may not be available.
        </div>
    );
}

export default OfflineBanner;
