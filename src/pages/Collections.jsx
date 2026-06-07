import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const Collections = ({ products, onAddToCart, search, setSearch, onProductClick, onNavigate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    // Reset page to 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <section className="collections-page">
            <div className="container">
                <div className="page-header" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h2 className="page-title">COLLECTIONS</h2>

                    <div className="archive-search-container" style={{ width: '100%', maxWidth: '600px', marginTop: '3rem' }}>
                        <div className="search-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', opacity: 0.2 }}>
                            <span style={{ fontSize: '0.5rem', letterSpacing: '0.3em', fontFamily: 'var(--font-mono)' }}>[ SYSTEM SCAN ACTIVE ]</span>
                            <span style={{ fontSize: '0.5rem', letterSpacing: '0.3em', fontFamily: 'var(--font-mono)' }}>V.2.04 ARCHIVE</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="electric-search-v2"
                                placeholder="SEARCH ARCHIVE..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && search.trim().toLowerCase() === 'admin') {
                                        onNavigate('login');
                                        setSearch('');
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="products-grid">
                    {currentItems.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onProductClick={onProductClick} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4rem', gap: '2rem' }}>
                        <button 
                            className="btn btn-outline" 
                            disabled={currentPage === 1} 
                            onClick={() => {
                                setCurrentPage(prev => Math.max(prev - 1, 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}
                        >
                            PRÉCÉDENT
                        </button>
                        
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
                            PAGE {currentPage} / {totalPages}
                        </span>
                        
                        <button 
                            className="btn btn-outline" 
                            disabled={currentPage === totalPages} 
                            onClick={() => {
                                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}
                        >
                            SUIVANT
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Collections;
