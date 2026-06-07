import React from 'react';
import Logo from '../Logo';

const Navbar = ({ cartCount, onNavigate, currentPage, isAdmin, onLogout }) => (
    <header>
        <div className="container header-inner">
            <a href="#" className="brand-link" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
                <Logo size={42} />
                <span className="brand-name">DOSEI</span>
            </a>
            <nav>
                <ul className="nav-links">
                    <li>
                        <a
                            href="#"
                            className={currentPage === 'home' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className={currentPage === 'collections' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); onNavigate('collections'); }}
                        >
                            Collections
                        </a>
                    </li>
                    {isAdmin && (
                        <>
                            <li style={{ opacity: 0.1 }}>|</li>
                            <li>
                                <a
                                    href="#"
                                    className={currentPage === 'admin_products' ? 'active' : ''}
                                    onClick={(e) => { e.preventDefault(); onNavigate('admin_products'); }}
                                    style={{ fontSize: '0.6rem', letterSpacing: '0.1rem' }}
                                >
                                    ADD PRODUCT
                                </a>
                            </li>
                            <li style={{ opacity: 0.1 }}>|</li>
                            <li>
                                <a
                                    href="#"
                                    className={currentPage === 'admin_orders' ? 'active' : ''}
                                    onClick={(e) => { e.preventDefault(); onNavigate('admin_orders'); }}
                                    style={{ fontSize: '0.6rem', letterSpacing: '0.1rem' }}
                                >
                                    ORDERS
                                </a>
                            </li>
                            <li style={{ opacity: 0.1 }}>|</li>
                            <li>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onLogout(); }}
                                    style={{ fontSize: '0.6rem', letterSpacing: '0.1rem', color: '#ff4d4d' }}
                                >
                                    DISCONNECT
                                </a>
                            </li>
                        </>
                    )}
                    <li className="cart-item" onClick={() => onNavigate('cart')} style={{ cursor: 'pointer' }}>
                        <span className="cart-label">CART</span>
                        <span className="cart-count">({cartCount})</span>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
);

export default Navbar;
