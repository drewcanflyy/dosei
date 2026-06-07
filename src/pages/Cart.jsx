import React from 'react';

const Cart = ({ cart, onRemoveFromCart, onNavigate }) => {

    // Simple total calculation for better archive feel
    const total = cart.reduce((acc, item) => {
        const price = parseInt(item.price.replace(' MAD', ''));
        return acc + price;
    }, 0);

    return (
        <section className="cart-page" style={{ paddingTop: '150px' }}>
            <div className="container">
                <button
                    className="back-btn"
                    onClick={() => onNavigate('collections')}
                    style={{ background: 'none', border: 'none', color: '#888', marginBottom: '2rem', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em' }}
                >
                    ← BACK TO ARCHIVE
                </button>
                <h2 className="page-title" style={{ textAlign: 'left', marginBottom: '4rem' }}>CART FILE</h2>

                {cart.length === 0 ? (
                    <div className="empty-cart" style={{ padding: '8rem 0', opacity: 0.5, letterSpacing: '0.2rem', textAlign: 'center' }}>
                        YOUR ARCHIVE IS EMPTY
                    </div>
                ) : (
                    <div className="cart-list">
                        <div className="cart-header" style={{ display: 'flex', borderBottom: '1px solid #111', paddingBottom: '1rem', marginBottom: '2rem', fontSize: '0.7rem', color: '#666', fontWeight: 900 }}>
                            <span style={{ flex: 1 }}>ITEM</span>
                            <span className="hide-mobile" style={{ width: '100px', textAlign: 'right' }}>PRICE</span>
                            <span style={{ width: '100px', textAlign: 'right' }}>ACTION</span>
                        </div>
                        {cart.map((item, index) => (
                            <div key={index} className="cart-item-row" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem 0', borderBottom: '1px solid #111', gap: '1.5rem' }}>
                                <div className="cart-item-image" style={{ width: '80px', height: '80px', background: '#0a0a0a', border: '1px solid #111', overflow: 'hidden' }}>
                                    {item.images && item.images.length > 0 ? (
                                        <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                                            <div className="technical-cross" style={{ width: '10px', height: '10px' }}></div>
                                        </div>
                                    )}
                                </div>
                                <div className="item-info" style={{ flex: 1 }}>
                                    <h3 className="cart-item-name" style={{ textTransform: 'uppercase', fontSize: 'clamp(1rem, 4vw, 1.4rem)', lineHeight: 1.1, marginBottom: '0.3rem' }}>{item.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <p style={{ fontSize: '0.6rem', color: '#666', fontFamily: 'var(--font-mono)' }}>ID {item.id}</p>
                                        <p className="mobile-only-price" style={{ fontSize: '0.8rem', fontWeight: 900, display: 'none' }}>{item.price}</p>
                                    </div>
                                </div>
                                <p className="hide-mobile" style={{ width: '100px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.price}</p>
                                <div style={{ width: '100px', textAlign: 'right' }}>
                                    <button
                                        className="remove-btn"
                                        onClick={() => onRemoveFromCart(index)}
                                        style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em' }}
                                    >
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="cart-summary" style={{ marginTop: '5rem', borderTop: '2px solid #fff', paddingTop: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>TOTAL AMOUNT</h3>
                                <p style={{ fontSize: '2.5rem', fontWeight: 900 }}>{total} MAD</p>
                            </div>
                            <button
                                className="btn"
                                style={{ width: '100%', padding: '2rem' }}
                                onClick={() => onNavigate('checkout')}
                            >
                                PROCEED TO CHECKOUT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Cart;
