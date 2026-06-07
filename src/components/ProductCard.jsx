import React from 'react';

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
    const isSoldOut = product.isOutOfStock;

    return (
        <div
            className={`product-card p-card-fixed-size ${isSoldOut ? 'sold-out' : ''}`}
            onClick={() => !isSoldOut && onProductClick && onProductClick(product)}
            style={{ opacity: isSoldOut ? 0.6 : 1, cursor: isSoldOut ? 'not-allowed' : 'pointer' }}
        >
            <div className="card-top-meta">
                <span className="p-tag">{product.tag}</span>
                <span className="p-id">ID {product.id}</span>
            </div>

            <div className="card-image-box" style={{ position: 'relative' }}>
                {isSoldOut && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-15deg)',
                        zIndex: 10,
                        border: '2px solid #fff',
                        padding: '0.4rem 1rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        letterSpacing: '0.2rem',
                        background: 'rgba(0,0,0,0.8)',
                        pointerEvents: 'none'
                    }}>
                        SOLD OUT
                    </div>
                )}
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: isSoldOut ? 'grayscale(1)' : 'none'
                        }}
                    />
                ) : (
                    <div className="img-placeholder">
                        <div className="technical-cross"></div>
                        <span>PRODUCT VISUAL</span>
                    </div>
                )}
            </div>

            <div className="card-info">
                <h3 className="p-name">{product.name}</h3>
                <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                    <span className="p-price">{product.price}</span>
                    {isSoldOut ? (
                        <span style={{ fontSize: '0.5rem', fontFamily: 'var(--font-mono)', border: '1px solid #333', padding: '0.4rem 0.8rem', opacity: 0.5 }}>
                            UNAVAILABLE
                        </span>
                    ) : (
                        <button className="add-btn" onClick={() => onAddToCart(product)}>
                            ADD TO CART
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
