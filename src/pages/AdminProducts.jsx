import React, { useState, useEffect } from 'react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form States
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [tag, setTag] = useState('NEW');
    const [category, setCategory] = useState('shirt');
    const [stocks, setStocks] = useState({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 });
    const [selectedImages, setSelectedImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // images already saved for the product
    const [description, setDescription] = useState('');

    const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        setSelectedImages([...e.target.files]);
    };

    const handleStockChange = (size, val) => {
        setStocks(prev => ({ ...prev, [size]: parseInt(val) || 0 }));
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setTag('NEW');
        setCategory('shirt');
        setStocks({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 });
        setSelectedImages([]);
        setExistingImages([]);
        setDescription('');
        setEditingProduct(null);
        setErrorMsg('');
        setSuccessMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        const formData = new FormData();
        formData.append('sku', editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 4).toUpperCase());
        formData.append('name', name);
        formData.append('price', price);
        formData.append('tag', tag);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('stocks', JSON.stringify(stocks));

        selectedImages.forEach(img => {
            formData.append('images', img);
        });

        try {
            const url = editingProduct
                ? `http://localhost:3001/api/products/${editingProduct.id}`
                : 'http://localhost:3001/api/products';
            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, { method, body: formData });
            const data = await response.json();

            if (response.ok) {
                setSuccessMsg(editingProduct ? 'PRODUCT UPDATED SUCCESSFULLY' : 'PRODUCT ARCHIVED SUCCESSFULLY');
                resetForm();
                fetchProducts();
            } else {
                setErrorMsg(data.error || 'SERVER ERROR - CHECK CONSOLE');
            }
        } catch (err) {
            setErrorMsg('CONNECTION FAILED — IS THE SERVER RUNNING?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (sku) => {
        if (!window.confirm('PERMANENTLY DELETE THIS ENTRY?')) return;
        try {
            const res = await fetch(`http://localhost:3001/api/products/${sku}`, { method: 'DELETE' });
            if (res.ok) {
                setSuccessMsg('ENTRY DELETED');
                fetchProducts();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (p) => {
        setEditingProduct(p);
        setName(p.name);
        setPrice(p.price_raw);
        setTag(p.tag || 'NEW');
        setCategory(p.category || 'shirt');
        setDescription(p.description || '');
        if (p.stocks && Object.keys(p.stocks).length > 0) {
            setStocks({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0, ...p.stocks });
        }
        setExistingImages(p.images || []); // load all existing images
        setSelectedImages([]);
        setErrorMsg('');
        setSuccessMsg('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const removeExistingImage = async (imageUrl) => {
        if (!editingProduct) return;
        // Optimistically remove from UI immediately
        setExistingImages(prev => prev.filter(img => img !== imageUrl));
        try {
            await fetch(`http://localhost:3001/api/products/${editingProduct.id}/images`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
            });
        } catch (err) {
            console.error('Failed to delete image:', err);
            // Re-add the image if the request failed
            setExistingImages(prev => [...prev, imageUrl]);
            setErrorMsg('Failed to delete image from server.');
        }
    };

    const labelStyle = {
        fontSize: '0.6rem',
        color: '#888',
        marginBottom: '0.8rem',
        display: 'block',
        letterSpacing: '0.2em',
        textTransform: 'uppercase'
    };

    const inputStyle = {
        width: '100%',
        background: '#0a0a0a',
        border: '1px solid #222',
        color: '#fff',
        padding: '1rem 1.2rem',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-mono)',
        outline: 'none',
        letterSpacing: '0.05em'
    };

    return (
        <div className="container" style={{ padding: '8rem 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '5rem', alignItems: 'start' }}>

                {/* ===== FORM SECTION ===== */}
                <section style={{ background: '#080808', padding: '3rem', border: '1px solid #1a1a1a' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #111' }}>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                            {editingProduct ? 'EDIT ENTRY' : 'ARCHIVE NEW PRODUCT'}
                        </h2>
                        {editingProduct && (
                            <span style={{ fontSize: '0.55rem', color: '#555', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>
                                REF: {editingProduct.id}
                            </span>
                        )}
                    </div>

                    {/* Messages */}
                    {successMsg && (
                        <div style={{ background: 'rgba(0,255,100,0.05)', border: '1px solid rgba(0,255,100,0.2)', color: '#0f0', padding: '1rem', marginBottom: '2rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                            ✓ {successMsg}
                        </div>
                    )}
                    {errorMsg && (
                        <div style={{ background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,0,0,0.2)', color: '#f55', padding: '1rem', marginBottom: '2rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                            ✗ {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Row 1: Name + Price */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Product Name</label>
                                <input
                                    required
                                    style={inputStyle}
                                    placeholder="e.g. ASPHALT HOODIE"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Price (MAD)</label>
                                <input
                                    required
                                    type="number"
                                    style={inputStyle}
                                    placeholder="e.g. 850"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Row 2: Category + Tag */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{ ...inputStyle, cursor: 'pointer' }}
                                >
                                    <option value="shirt">SHIRT</option>
                                    <option value="hoodie">HOODIE</option>
                                    <option value="pants">PANTS</option>
                                    <option value="outerwear">OUTERWEAR</option>
                                    <option value="caps">CAPS</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Tag</label>
                                <select
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    style={{ ...inputStyle, cursor: 'pointer' }}
                                >
                                    <option value="NEW">NEW</option>
                                    <option value="HEAVYWEIGHT">HEAVYWEIGHT</option>
                                    <option value="LIMITED">LIMITED</option>
                                    <option value="ARCHIVE">ARCHIVE</option>
                                </select>
                            </div>
                        </div>

                        {/* Stock Registry */}
                        <div>
                            <label style={labelStyle}>Stock Registry — Units per Size</label>
                            <div style={{ fontSize: '0.5rem', color: '#444', fontFamily: 'var(--font-mono)', marginBottom: '0.8rem' }}>
                                For CAPS/accessories: use the first size (S) as total ONE SIZE stock
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.8rem' }}>
                                {sizes.map(s => (
                                    <div key={s} style={{ border: '1px solid #1a1a1a', padding: '0.8rem', textAlign: 'center', background: '#050505' }}>
                                        <div style={{ fontSize: '0.6rem', color: '#888', marginBottom: '0.5rem' }}>{s}</div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={stocks[s]}
                                            onChange={(e) => handleStockChange(s, e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '1rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the product — material, fit, details..."
                                rows={4}
                                style={{
                                    ...inputStyle,
                                    resize: 'vertical',
                                    lineHeight: 1.6,
                                    fontFamily: 'var(--font-main)',
                                    fontSize: '0.82rem',
                                    letterSpacing: '0',
                                }}
                            />
                        </div>

                        {/* Upload Zone */}
                        <div>
                            <label style={labelStyle}>Visual Assets — Upload from PC (Multiple)</label>

                            {/* EXISTING IMAGES (shown when editing) */}
                            {existingImages.length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '0.5rem', color: '#555', fontFamily: 'var(--font-mono)', marginBottom: '0.8rem' }}>
                                        SAVED IMAGES ({existingImages.length}) — Click X to remove
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.8rem' }}>
                                        {existingImages.map((url, i) => (
                                            <div key={i} style={{ aspectRatio: '1', background: '#111', border: '1px solid #333', overflow: 'hidden', position: 'relative' }}>
                                                <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`saved-${i}`} />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(url)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '2px',
                                                        right: '2px',
                                                        background: 'rgba(0,0,0,0.85)',
                                                        border: '1px solid #f00',
                                                        color: '#f00',
                                                        width: '18px',
                                                        height: '18px',
                                                        fontSize: '0.5rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{
                                border: '1px dashed #333',
                                padding: '2.5rem 2rem',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.8rem',
                                background: '#050505',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }}
                                />
                                <div style={{ fontSize: '1.5rem', opacity: 0.3 }}>⬆</div>
                                <div style={{ fontSize: '0.7rem', color: '#aaa', fontFamily: 'var(--font-mono)' }}>
                                    CLICK TO SELECT — OR DRAG & DROP
                                </div>
                                <div style={{ fontSize: '0.55rem', color: '#555' }}>
                                    JPG / PNG / WEBP — MULTIPLE FILES ALLOWED
                                </div>
                            </div>

                            {/* NEW Image Preview Gallery */}
                            {selectedImages.length > 0 && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <div style={{ fontSize: '0.55rem', color: '#666', marginBottom: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                                        {selectedImages.length} NEW FILE{selectedImages.length > 1 ? 'S' : ''} READY TO UPLOAD
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.8rem' }}>
                                        {selectedImages.map((file, i) => (
                                            <div key={i} style={{ aspectRatio: '1', background: '#111', border: '1px solid #0a4a0a', overflow: 'hidden' }}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    alt={`preview-${i}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #111' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    background: loading ? '#111' : '#fff',
                                    color: loading ? '#444' : '#000',
                                    border: 'none',
                                    padding: '1.4rem',
                                    fontSize: '0.75rem',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 900,
                                    letterSpacing: '0.15em',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {loading ? 'PROCESSING...' : editingProduct ? 'UPDATE DATABASE ENTRY' : 'COMMIT TO ARCHIVE'}
                            </button>
                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{
                                        width: '120px',
                                        background: 'transparent',
                                        color: '#666',
                                        border: '1px solid #222',
                                        padding: '1.4rem',
                                        fontSize: '0.65rem',
                                        fontFamily: 'var(--font-mono)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    CANCEL
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* ===== INVENTORY SECTION ===== */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #111' }}>
                        <h3 style={{ margin: 0, fontSize: '0.6rem', color: '#aaa', fontFamily: 'var(--font-mono)', letterSpacing: '0.3em' }}>
                            LIVE INVENTORY
                        </h3>
                        <span style={{ fontSize: '0.55rem', color: '#555', fontFamily: 'var(--font-mono)' }}>
                            {products.length} UNITS
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {products.length === 0 && (
                            <div style={{ fontSize: '0.65rem', color: '#333', fontFamily: 'var(--font-mono)', textAlign: 'center', padding: '3rem 0' }}>
                                NO PRODUCTS IN DATABASE
                            </div>
                        )}
                        {products.map(p => (
                            <div
                                key={p.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: '#050505',
                                    border: '1px solid #111',
                                    padding: '1.2rem',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                    {/* Thumbnail */}
                                    <div style={{ width: '50px', height: '65px', background: '#0a0a0a', flexShrink: 0, overflow: 'hidden' }}>
                                        {p.images && p.images[0] ? (
                                            <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ width: '12px', height: '12px', border: '1px solid #222' }}></div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Info */}
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff', marginBottom: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.name}
                                        </div>
                                        <div style={{ fontSize: '0.55rem', color: '#555', fontFamily: 'var(--font-mono)' }}>
                                            {p.id} · {p.price}
                                        </div>
                                        <div style={{ fontSize: '0.5rem', color: p.isOutOfStock ? '#600' : '#060', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                                            {p.isOutOfStock ? '● OUT OF STOCK' : '● IN STOCK'}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button
                                        onClick={() => startEdit(p)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #222',
                                            color: '#aaa',
                                            fontSize: '0.55rem',
                                            padding: '0.6rem 1rem',
                                            cursor: 'pointer',
                                            fontFamily: 'var(--font-mono)',
                                            letterSpacing: '0.1em'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#aaa'; }}
                                    >
                                        EDIT
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #220000',
                                            color: '#660000',
                                            fontSize: '0.55rem',
                                            padding: '0.6rem 1rem',
                                            cursor: 'pointer',
                                            fontFamily: 'var(--font-mono)',
                                            letterSpacing: '0.1em'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f00'; e.currentTarget.style.color = '#f00'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#220000'; e.currentTarget.style.color = '#660000'; }}
                                    >
                                        DELETE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AdminProducts;
