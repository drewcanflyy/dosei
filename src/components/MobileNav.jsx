import React from 'react';

const MobileNav = ({ currentPage, cartCount, onNavigate, isAdmin }) => {
    return (
        <nav className="mobile-nav">
            <div className="mobile-nav-inner">
                <a
                    href="#"
                    className={`mobile-nav-item ${currentPage === 'home' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
                >
                    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </a>
                <a
                    href="#"
                    className={`mobile-nav-item ${currentPage === 'collections' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate('collections'); }}
                >
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    <span>Collections</span>
                </a>
                <a
                    href="#"
                    className={`mobile-nav-item ${currentPage === 'cart' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate('cart'); }}
                >
                    <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    <span>Cart ({cartCount})</span>
                </a>
                {isAdmin && (
                    <a
                        href="#"
                        className={`mobile-nav-item ${currentPage === 'admin_orders' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('admin_orders'); }}
                    >
                        <svg viewBox="0 0 24 24"><path d="M12 2L3 7v9c0 5 9 8 9 8s9-3 9-8V7l-9-5Z"></path></svg>
                        <span>Orders</span>
                    </a>
                )}
            </div>
        </nav>
    );
};

export default MobileNav;
