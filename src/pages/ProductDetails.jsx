import React, { useState } from 'react';

// Categories that don't use sizes — just a total stock
const NO_SIZE_CATEGORIES = ['caps', 'accessories', 'cap'];

const ProductDetails = ({ product, onAddToCart, onNavigate }) => {
    const allDefinedSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    const isNoSize = product?.category && NO_SIZE_CATEGORIES.includes(product.category.toLowerCase());

    const availableSizes = !isNoSize && product?.stocks && Object.keys(product.stocks).length > 0
        ? allDefinedSizes.filter(s => s in product.stocks)
        : [];

    const firstInStockSize = availableSizes.find(s => product?.stocks && product.stocks[s] > 0) || null;
    const [selectedSize, setSelectedSize] = useState(firstInStockSize);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sizeWarning, setSizeWarning] = useState('');
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const hasImages = product.images && product.images.length > 0;

    // For no-size products, total stock = sum of all stock values (or direct stock value)
    const totalStock = product.stocks
        ? Object.values(product.stocks).reduce((acc, v) => acc + v, 0)
        : 0;

    const selectedSizeStock = isNoSize
        ? totalStock
        : (selectedSize && product.stocks ? (product.stocks[selectedSize] || 0) : 0);

    const canAddToCart = isNoSize
        ? totalStock > 0
        : (selectedSize && selectedSizeStock > 0);

    const maxQty = Math.min(selectedSizeStock, 10); // cap at 10 or available stock

    const handleQtyChange = (delta) => {
        setQuantity(prev => Math.max(1, Math.min(prev + delta, maxQty || 1)));
    };

    const handleNextImage = () => {
        if (!hasImages) return;
        setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
    };

    const handlePrevImage = () => {
        if (!hasImages) return;
        setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
    };

    const handleAddToCart = () => {
        if (!isNoSize && !selectedSize) {
            setSizeWarning('Please select a size first.');
            setTimeout(() => setSizeWarning(''), 3000);
            return;
        }
        if (selectedSizeStock === 0) {
            setSizeWarning('This item is out of stock.');
            setTimeout(() => setSizeWarning(''), 3000);
            return;
        }
        // Add to cart with quantity
        onAddToCart(product, isNoSize ? 'ONE SIZE' : selectedSize, quantity);
        setSizeWarning('');
    };

    return (
        <section className="product-details-page">
            <div className="container">
                <div className="details-grid">

                    {/* IMAGE SECTION */}
                    <div className="details-image-section">
                        <div className="details-image-box" style={{ position: 'relative' }}>
                            {hasImages && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        style={{
                                            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                                            zIndex: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                                            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', borderRadius: '50%'
                                        }}
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        style={{
                                            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                            zIndex: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                                            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', borderRadius: '50%'
                                        }}
                                    >
                                        →
                                    </button>
                                </>
                            )}
                            {hasImages ? (
                                <img
                                    src={product.images[currentImageIndex]}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div className="img-placeholder">
                                    <div className="technical-cross"></div>
                                    <span>PRODUCT VISUAL</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {hasImages && product.images.length > 1 && (
                            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        style={{
                                            width: '70px',
                                            aspectRatio: '1',
                                            border: currentImageIndex === idx ? '1px solid #fff' : '1px solid #1a1a1a',
                                            cursor: 'pointer',
                                            opacity: currentImageIndex === idx ? 1 : 0.45,
                                            transition: 'all 0.3s ease',
                                            overflow: 'hidden',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img src={img} alt={`view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INFO SECTION */}
                    <div className="details-info-section">
                        <div className="details-meta">
                            <span className="p-tag">{product.tag}</span>
                            <span className="p-id">REF: {product.id}</span>
                        </div>

                        <h1 className="details-name">{product.name}</h1>
                        <p className="details-price">{product.price}</p>

                        {/* DESCRIPTION */}
                        {product.description && (
                            <div className="details-description" style={{ marginBottom: '2rem' }}>
                                <p style={{ color: '#aaa', lineHeight: 1.7, fontSize: '0.85rem' }}>
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* ========== SIZE SELECTION (only for sized products) ========== */}
                        {!isNoSize && availableSizes.length > 0 && (
                            <div className="size-selection" style={{ marginBottom: '1.5rem' }}>
                                <label className="section-label" style={{ color: '#fff', display: 'block', marginBottom: '1rem' }}>SELECT SIZE</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
                                    {availableSizes.map(size => {
                                        const qty = product.stocks ? (product.stocks[size] || 0) : 0;
                                        const oos = qty === 0;
                                        const isSelected = selectedSize === size;

                                        return (
                                            <button
                                                key={size}
                                                onClick={() => { if (!oos) { setSelectedSize(size); setQuantity(1); setSizeWarning(''); } }}
                                                style={{
                                                    position: 'relative',
                                                    padding: '1rem 0.5rem 0.7rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.3rem',
                                                    background: isSelected ? '#fff' : 'transparent',
                                                    border: isSelected ? '1px solid #fff' : oos ? '1px solid #111' : '1px solid #222',
                                                    color: isSelected ? '#000' : oos ? '#333' : '#fff',
                                                    cursor: oos ? 'not-allowed' : 'pointer',
                                                    overflow: 'hidden',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <span style={{ fontSize: '1rem', fontWeight: 900 }}>{size}</span>
                                                <span style={{
                                                    fontSize: '0.4rem',
                                                    fontFamily: 'var(--font-mono)',
                                                    color: isSelected ? '#333' : oos ? '#550000' : '#3a7a3a'
                                                }}>
                                                    {oos ? 'OUT OF STOCK' : `${qty} LEFT`}
                                                </span>
                                                {oos && (
                                                    <div style={{
                                                        position: 'absolute', width: '130%', height: '1px',
                                                        background: 'rgba(255,255,255,0.08)', top: '50%', left: '-15%',
                                                        transform: 'rotate(-20deg)'
                                                    }} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ========== NO-SIZE STOCK DISPLAY (caps etc.) ========== */}
                        {isNoSize && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                border: '1px solid #1a1a1a',
                                background: '#050505'
                            }}>
                                <span style={{ fontSize: '0.55rem', color: '#888', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>
                                    ONE SIZE
                                </span>
                                <span style={{ width: '1px', height: '1.2rem', background: '#222' }}></span>
                                <span style={{
                                    fontSize: '0.55rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: totalStock > 0 ? '#3a7' : '#733',
                                    letterSpacing: '0.1em'
                                }}>
                                    {totalStock > 0 ? `${totalStock} IN STOCK` : 'OUT OF STOCK'}
                                </span>
                            </div>
                        )}

                        {/* SIZE WARNING */}
                        {sizeWarning && (
                            <div style={{
                                background: 'rgba(255,50,50,0.08)',
                                border: '1px solid rgba(255,50,50,0.25)',
                                color: '#ff5555',
                                padding: '0.8rem 1.2rem',
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-mono)',
                                marginBottom: '1rem',
                            }}>
                                ⚠ {sizeWarning}
                            </div>
                        )}

                        {/* SELECTED SIZE STATUS */}
                        {!isNoSize && selectedSize && (
                            <div style={{
                                fontSize: '0.55rem',
                                fontFamily: 'var(--font-mono)',
                                color: canAddToCart ? '#3a7' : '#733',
                                marginBottom: '1rem',
                                letterSpacing: '0.1em'
                            }}>
                                {canAddToCart
                                    ? `✓ SIZE ${selectedSize} — ${selectedSizeStock} UNIT${selectedSizeStock > 1 ? 'S' : ''} AVAILABLE`
                                    : `✗ SIZE ${selectedSize} — OUT OF STOCK`}
                            </div>
                        )}

                        {/* ========== QUANTITY PICKER ========== */}
                        {canAddToCart && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '0.55rem', color: '#888', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>QTY</span>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #222', background: '#050505' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleQtyChange(-1)}
                                        style={{
                                            width: '38px', height: '38px', background: 'transparent',
                                            border: 'none', color: quantity <= 1 ? '#333' : '#fff',
                                            fontSize: '1.2rem', cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >−</button>
                                    <span style={{
                                        width: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)',
                                        fontSize: '0.9rem', color: '#fff', borderLeft: '1px solid #1a1a1a', borderRight: '1px solid #1a1a1a',
                                        lineHeight: '38px'
                                    }}>
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleQtyChange(1)}
                                        style={{
                                            width: '38px', height: '38px', background: 'transparent',
                                            border: 'none', color: quantity >= maxQty ? '#333' : '#fff',
                                            fontSize: '1.2rem', cursor: quantity >= maxQty ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >+</button>
                                </div>
                                {maxQty <= 3 && maxQty > 0 && (
                                    <span style={{ fontSize: '0.5rem', color: '#a63', fontFamily: 'var(--font-mono)' }}>
                                        ONLY {maxQty} LEFT
                                    </span>
                                )}
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="details-actions">
                            <button
                                className="btn details-add-btn"
                                onClick={handleAddToCart}
                                style={{
                                    opacity: canAddToCart ? 1 : 0.5,
                                    cursor: canAddToCart ? 'pointer' : 'not-allowed',
                                    background: canAddToCart ? '#fff' : '#111',
                                    color: canAddToCart ? '#000' : '#444',
                                }}
                            >
                                {product.isOutOfStock
                                    ? 'OUT OF STOCK'
                                    : !isNoSize && !selectedSize
                                        ? 'SELECT A SIZE'
                                        : canAddToCart
                                            ? `ADD ${quantity > 1 ? `(${quantity})` : ''} TO CART`
                                            : 'UNAVAILABLE'}
                            </button>
                            <button className="back-link" onClick={() => onNavigate('collections')}>
                                Back to Archive
                            </button>
                        </div>

                        <div className="technical-specs">
                            <div className="spec-item">
                                <span className="spec-label">MATERIAL</span>
                                <span className="spec-value">100% HEAVY COTTON / 450GSM</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">FIT</span>
                                <span className="spec-value">{isNoSize ? 'ONE SIZE FITS ALL' : 'OVERSIZED / BOXY'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">ORIGIN</span>
                                <span className="spec-value">MADE IN MOROCCO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetails;
