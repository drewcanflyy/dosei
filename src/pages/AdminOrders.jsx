import React from 'react';

const AdminOrders = ({ orders, onClearOrder, onClearAll }) => {
    return (
        <div className="container" style={{ padding: '8rem 2rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid #111' }}>
                <h2 className="section-title" style={{ textAlign: 'left', margin: 0, fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
                    CHECKOUT ORDERS
                </h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.55rem', color: '#444', fontFamily: 'var(--font-mono)' }}>
                        {orders.length} ORDER{orders.length !== 1 ? 'S' : ''}
                    </span>
                    {orders.length > 0 && (
                        <button
                            onClick={onClearAll}
                            style={{
                                background: 'transparent',
                                border: '1px solid #330000',
                                color: '#660000',
                                fontSize: '0.55rem',
                                padding: '0.6rem 1.2rem',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-mono)',
                                letterSpacing: '0.1em',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f00'; e.currentTarget.style.color = '#f00'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#330000'; e.currentTarget.style.color = '#660000'; }}
                        >
                            CLEAR ALL
                        </button>
                    )}
                </div>
            </div>

            {orders.length === 0 ? (
                <div style={{ padding: '10rem 0', textAlign: 'center', opacity: 0.15, letterSpacing: '0.4rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    NO ORDERS FOUND
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {orders.map((order, index) => (
                        <div key={index} style={{
                            background: '#050505',
                            border: '1px solid #111',
                            padding: '2.5rem',
                        }}>
                            {/* Order Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #0a0a0a' }}>
                                <div>
                                    <div style={{ fontSize: '0.5rem', color: '#444', letterSpacing: '0.3rem', marginBottom: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                                        ORDER #{String(orders.length - index).padStart(4, '0')}
                                    </div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                                        {order.customer?.fullName?.toUpperCase() || 'UNNAMED'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.5rem', color: '#444', letterSpacing: '0.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>TOTAL</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{order.total} MAD</div>
                                    </div>
                                    <button
                                        onClick={() => onClearOrder(index)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #1a0000',
                                            color: '#440000',
                                            fontSize: '0.55rem',
                                            padding: '0.6rem 1rem',
                                            cursor: 'pointer',
                                            fontFamily: 'var(--font-mono)',
                                            letterSpacing: '0.1em',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#f00'; e.currentTarget.style.color = '#f00'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a0000'; e.currentTarget.style.color = '#440000'; }}
                                    >
                                        DELETE
                                    </button>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>

                                {/* Customer Info */}
                                <div>
                                    <div style={{ fontSize: '0.5rem', color: '#444', letterSpacing: '0.25rem', marginBottom: '1.2rem', fontFamily: 'var(--font-mono)' }}>
                                        DELIVERY INFO
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        {[
                                            { label: 'ADDRESS', value: order.customer?.address },
                                            { label: 'PHONE', value: order.customer?.phone },
                                            { label: 'EMAIL', value: order.customer?.email },
                                        ].map(({ label, value }) => value ? (
                                            <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                                                <span style={{ fontSize: '0.5rem', color: '#333', fontFamily: 'var(--font-mono)', width: '60px', flexShrink: 0 }}>{label}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{value}</span>
                                            </div>
                                        ) : null)}
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <div style={{ fontSize: '0.5rem', color: '#444', letterSpacing: '0.25rem', marginBottom: '1.2rem', fontFamily: 'var(--font-mono)' }}>
                                        ITEMS ({order.items?.length || 0})
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.8rem', borderBottom: '1px solid #080808' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>{item.name}</div>
                                                    {item.selectedSize && (
                                                        <div style={{ fontSize: '0.5rem', color: '#444', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                                                            SIZE: {item.selectedSize}
                                                        </div>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '0.8rem', color: '#aaa', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
