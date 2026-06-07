import React, { useState } from 'react';

const Checkout = ({ cart, onOrderComplete, onNavigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: 'CASABLANCA',
        phone: ''
    });

    const [orderDone, setOrderDone] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const customer = {
            fullName: e.target[0].value,
            email: e.target[1].value,
            address: e.target[2].value,
            phone: e.target[3].value,
        };
        const order = {
            customer,
            items: cart,
            total: cart.reduce((a, b) => a + parseInt(b.price.replace(' MAD', '')), 0),
            date: new Date().toLocaleString()
        };
        setOrderDone(true);
        // We trigger the parent update but keep the local success screen
        setTimeout(() => {
            onOrderComplete(order);
        }, 100);
    };

    if (orderDone) {
        return (
            <div className="container" style={{ padding: '15rem 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: '8vw', textTransform: 'uppercase', marginBottom: '2rem' }}>ORDER PLACED</h1>
                <p style={{ letterSpacing: '0.4em', color: '#888' }}>PROCESSING SHIPMENT ID {Math.floor(Math.random() * 1000000)}</p>
                <div style={{ marginTop: '5rem' }}>
                    <button className="btn" onClick={() => onNavigate('home')}>RETURN HOME</button>
                </div>
            </div>
        );
    }

    return (
        <section className="checkout-page" style={{ paddingTop: '150px' }}>
            <div className="container">
                <button
                    className="back-btn"
                    onClick={() => onNavigate('cart')}
                    style={{ background: 'none', border: 'none', color: '#888', marginBottom: '2rem', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                    ← BACK TO CART
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem' }}>

                    <div className="checkout-form-wrap">
                        <h2 className="page-title" style={{ textAlign: 'left', marginBottom: '4rem', fontSize: '4rem' }}>SHIPPING INFO</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.6rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>FULL NAME</label>
                                <input required type="text" className="checkout-input" style={{ width: '100%', border: 'none', borderBottom: '1px solid #222', background: 'transparent', color: '#fff', padding: '1rem 0' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.6rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                                <input required type="email" className="checkout-input" style={{ width: '100%', border: 'none', borderBottom: '1px solid #222', background: 'transparent', color: '#fff', padding: '1rem 0' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.6rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>SHIPPING ADDRESS</label>
                                <textarea required rows="1" className="checkout-input" style={{ width: '100%', border: 'none', borderBottom: '1px solid #222', background: 'transparent', color: '#fff', padding: '1rem 0', resize: 'none' }}></textarea>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.6rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>PHONE NUMBER</label>
                                <input required type="tel" className="checkout-input" style={{ width: '100%', border: 'none', borderBottom: '1px solid #222', background: 'transparent', color: '#fff', padding: '1rem 0' }} />
                            </div>
                            <button type="submit" className="btn" style={{ marginTop: '3rem', width: '100%', padding: '2rem' }}>COMPLETE ORDER PROCESS</button>
                        </form>
                    </div>

                    <div className="order-summary-box" style={{ background: '#050505', border: '1px solid #111', padding: '4rem' }}>
                        <h3 style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.3em', marginBottom: '3rem' }}>ARCHIVE SUMMARY</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {cart.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span>{item.name}</span>
                                    <span>{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '4rem', borderTop: '1px solid #222', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: '#666' }}>FINAL AMOUNT</span>
                            <span style={{ fontSize: '2rem', fontWeight: 900 }}>{cart.reduce((a, b) => a + parseInt(b.price.replace(' MAD', '')), 0)} MAD</span>
                        </div>
                        <p style={{ marginTop: '3rem', fontSize: '0.6rem', color: '#333', textAlign: 'center', lineHeight: '1.6' }}>
                            BY COMPLETING THIS ORDER, YOU AGREE TO OUR TERMS AND CONDITIONS. ALL SALES ARE FINAL.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;
