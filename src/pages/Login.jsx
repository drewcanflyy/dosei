import React, { useState } from 'react';

const Login = ({ onLogin, onNavigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            onLogin(true);
            onNavigate('admin_products');
        } else {
            setError('INVALID CREDENTIALS — ACCESS REJECTED');
        }
    };

    return (
        <div className="container" style={{ padding: '15rem 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', background: '#050505', border: '1px solid #111', padding: '4rem', borderRadius: '4px' }}>
                <h2 style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '0.4rem', marginBottom: '3rem', textAlign: 'center' }}>SECURE AUTH GATE</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.55rem', color: '#444', display: 'block', marginBottom: '1rem' }}>IDENTIFIER</label>
                        <input
                            required
                            type="text"
                            className="checkout-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #222', color: '#fff', padding: '1rem 0', fontFamily: 'var(--font-mono)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.55rem', color: '#444', display: 'block', marginBottom: '1rem' }}>PASS KEY</label>
                        <input
                            required
                            type="password"
                            className="checkout-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #222', color: '#fff', padding: '1rem 0', fontFamily: 'var(--font-mono)' }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#ff4d4d', fontSize: '0.6rem', textAlign: 'center', letterSpacing: '0.1rem' }}>{error}</p>
                    )}

                    <button type="submit" className="btn" style={{ marginTop: '2rem', width: '100%', padding: '1.5rem' }}>AUTHENTICATE</button>

                    <button
                        type="button"
                        onClick={() => onNavigate('home')}
                        style={{ background: 'none', border: 'none', color: '#444', fontSize: '0.6rem', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        CANCEL
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
