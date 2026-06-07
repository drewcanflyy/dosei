import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import Logo from './Logo';

const App = () => {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(() => {
        const saved = localStorage.getItem('dosei_page');
        // Admin pages require re-authentication on refresh, so fall back to home
        if (saved && !saved.startsWith('admin')) return saved;
        return 'home';
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [orders, setOrders] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // Original boot timer (optional, kept for transition)
        // setTimeout(() => setLoading(false), 2000);
    }, []);

    const addToCart = (product, selectedSize = 'ONE SIZE', qty = 1) => {
        setCart(prev => [...prev, { ...product, selectedSize, quantity: qty }]);
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleNavigate = (page) => {
        window.scrollTo(0, 0);
        setCurrentPage(page);
        localStorage.setItem('dosei_page', page);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        handleNavigate('product_details');
    };

    const handleAddProduct = (newProduct) => {
        setProducts([newProduct, ...products]);
        handleNavigate('collections');
    };

    const handleLogout = () => {
        setIsAdmin(false);
        handleNavigate('home');
    };

    const saveOrder = (order) => {
        setOrders(prev => [order, ...prev]);
        setCart([]);
    };

    const clearOrder = (index) => {
        setOrders(prev => prev.filter((_, i) => i !== index));
    };

    const clearAllOrders = () => {
        if (window.confirm('Clear all orders?')) setOrders([]);
    };

    if (loading) {
        return (
            <div className="preloader" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                zIndex: 9999
            }}>
                <div style={{ animation: 'pulse 2s infinite ease-in-out' }}>
                    <Logo size={160} />
                </div>
                <div style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.5em',
                    opacity: 0.2,
                    marginTop: '2rem',
                    fontFamily: 'var(--font-mono)'
                }}>
                    INITIALIZING ARCHIVE
                </div>
            </div>
        );
    }

    return (
        <div className="app-wrapper">
            <Navbar
                cartCount={cart.length}
                onNavigate={handleNavigate}
                currentPage={currentPage}
                isAdmin={isAdmin}
                onLogout={handleLogout}
            />

            <main>
                {currentPage === 'home' && (
                    <>
                        <Home
                            products={products}
                            onAddToCart={addToCart}
                            onProductClick={handleProductClick}
                            onExplore={() => handleNavigate('collections')}
                        />
                        <Footer onNavigate={handleNavigate} />
                    </>
                )}
                {currentPage === 'collections' && (
                    <>
                        <Collections
                            products={products}
                            onAddToCart={addToCart}
                            search={search}
                            setSearch={setSearch}
                            onProductClick={handleProductClick}
                            onNavigate={handleNavigate}
                        />
                        <Footer onNavigate={handleNavigate} />
                    </>
                )}
                {currentPage === 'cart' && (
                    <>
                        <Cart
                            cart={cart}
                            onRemoveFromCart={removeFromCart}
                            onNavigate={handleNavigate}
                        />
                        <Footer onNavigate={handleNavigate} />
                    </>
                )}
                {currentPage === 'checkout' && (
                    <>
                        <Checkout
                            cart={cart}
                            onOrderComplete={saveOrder}
                            onNavigate={handleNavigate}
                        />
                        <Footer onNavigate={handleNavigate} />
                    </>
                )}
                {currentPage === 'login' && (
                    <>
                        <Login onLogin={setIsAdmin} onNavigate={handleNavigate} />
                        <Footer onNavigate={handleNavigate} />
                    </>
                )}
                {isAdmin && currentPage === 'admin_products' && (
                    <>
                        <AdminProducts onAddProduct={handleAddProduct} />
                        <Footer onNavigate={handleNavigate} />
                    </>
                )}
                {isAdmin && currentPage === 'admin_orders' && (
                    <>
                        <AdminOrders orders={orders} onClearOrder={clearOrder} onClearAll={clearAllOrders} />
                        <Footer onNavigate={handleNavigate} />
                    </>
                )}
                {currentPage === 'product_details' && (
                    <>
                        <ProductDetails
                            product={selectedProduct}
                            onAddToCart={addToCart}
                            onNavigate={handleNavigate}
                        />
                        <Footer onNavigate={handleNavigate} />
                    </>
                )}
            </main>

            <MobileNav
                currentPage={currentPage}
                cartCount={cart.length}
                onNavigate={handleNavigate}
                isAdmin={isAdmin}
            />
        </div>
    );
};

export default App;
