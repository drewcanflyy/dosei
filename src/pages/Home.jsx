import React from 'react';
import ProductCard from '../components/ProductCard';

const Home = ({ products, onAddToCart, onProductClick, onExplore }) => (
    <div className="home-container">
        <section id="hero" className="hero full-viewport">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="hero-video"
            >
                <source src={`${import.meta.env.BASE_URL}fury.mp4`} type="video/mp4" />
            </video>

            <div className="hero-cta-wrap" style={{ position: 'absolute', bottom: '15%', zIndex: 10 }}>
                <button
                    className="btn btn-transparent-outline"
                    onClick={() => onExplore()}
                    style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    ENTER ARCHIVE
                </button>
            </div>
        </section>

        <section className="featured-products container" style={{ padding: '8rem 0' }}>
            <h2 className="section-title">FEATURED SELECTION</h2>
            <div className="products-grid">
                {products.slice(0, 4).map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onProductClick={onProductClick} />
                ))}
            </div>
            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <button className="btn btn-outline" onClick={() => onExplore()}>VIEW ALL COLLECTIONS</button>
            </div>
        </section>

        <section id="vision" className="vision-section container" style={{ padding: '10rem 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                <h2 className="section-title">VISION</h2>
                <p className="vision-text">
                    DOSEI is an exploration of urban kinetics—a brand engineered to capture
                    the raw energy of Casablanca and translate it into apparel that defines
                    the transit. We create for the pavement, for the heat of the night,
                    and the concrete of the day.
                </p>
                <div style={{ marginTop: '4rem', fontSize: '0.8rem', letterSpacing: '0.5em', color: '#444', fontWeight: 900 }}>
                    ASPHALT // ENERGY // MOTION
                </div>
            </div>
        </section>
    </div>
);

export default Home;
