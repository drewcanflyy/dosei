import React from 'react';

const Footer = ({ onNavigate }) => (
    <footer>
        <div className="container">
            <div className="footer-layout">
                <div className="footer-brand">
                    <div className="f-logo">DOSEI</div>
                    <p className="f-desc">Independent technical archive exploring urban kinetics and the raw energy of the street.</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p
                    onClick={() => onNavigate('admin_products')}
                    style={{ cursor: 'default', opacity: 0.5 }}
                    title="ARCHIVE_PORTAL"
                >
                    © 2026 DOSEI. ENGINEERED IN CASABLANCA.
                </p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <p onClick={() => onNavigate('admin_orders')} style={{ cursor: 'pointer', opacity: 0.05 }}>[ INTERNAL_INDEX ]</p>
                    <p>ALL RIGHT RESERVED : drewcanflyy</p>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
