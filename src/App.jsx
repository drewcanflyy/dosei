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
                    localStorage.setItem('dosei_products', JSON.stringify(data));
                } else {
                    throw new Error('API server returned error status');
                }
            } catch (error) {
                console.warn('API connection failed. Falling back to local storage mock data.');
                const saved = localStorage.getItem('dosei_products');
                if (saved) {
                    setProducts(JSON.parse(saved));
                } else {
                    const defaultProducts = [
                        {
                            internal_id: 1,
                            id: "001",
                            name: "Asphalt Hoodie",
                            price_raw: 850,
                            price: "850 MAD",
                            tag: "HEAVYWEIGHT",
                            category_name: "Hoodie",
                            category: "hoodie",
                            description: "Premium heavyweight asphalt hoodie designed for ultimate comfort and minimal street aesthetic.",
                            images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800"],
                            stocks: { S: 10, M: 15, L: 5, XL: 0, XXL: 0, XXXL: 0 },
                            isOutOfStock: false
                        },
                        {
                            internal_id: 2,
                            id: "002",
                            name: "Static Tee",
                            price_raw: 450,
                            price: "450 MAD",
                            tag: "LIMITED",
                            category_name: "Shirt",
                            category: "shirt",
                            description: "Boxy fit custom screen-print tee with static graphic artwork on front and back.",
                            images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800"],
                            stocks: { S: 0, M: 20, L: 20, XL: 10, XXL: 0, XXXL: 0 },
                            isOutOfStock: false
                        },
                        {
                            internal_id: 3,
                            id: "003",
                            name: "Tonal Cap",
                            price_raw: 320,
                            price: "320 MAD",
                            tag: "NEW",
                            category_name: "Caps",
                            category: "caps",
                            description: "6-panel classic cotton strapback cap with tonal brand embroidery.",
                            images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800"],
                            stocks: { S: 5, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 },
                            isOutOfStock: false
                        },
                        {
                            internal_id: 4,
                            id: "004",
                            name: "Raw Denim",
                            price_raw: 1200,
                            price: "1200 MAD",
                            tag: "ARCHIVE",
                            category_name: "Pants",
                            category: "pants",
                            description: "14oz raw selvedge denim in a relaxed straight silhouette.",
                            images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800"],
                            stocks: { S: 0, M: 0, L: 8, XL: 8, XXL: 0, XXXL: 0 },
                            isOutOfStock: false
                        },
                        {
                            internal_id: 5,
                            id: "005",
                            name: "Heavyweight Overshirt",
                            price_raw: 950,
                            price: "950 MAD",
                            tag: "HEAVYWEIGHT",
                            category_name: "Outerwear",
                            category: "outerwear",
                            description: "Relaxed fit overshirt in thick brushed wool blend.",
                            images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800"],
                            stocks: { S: 0, M: 12, L: 12, XL: 0, XXL: 0, XXXL: 0 },
                            isOutOfStock: false
                        }
                    ];
                    setProducts(defaultProducts);
                    localStorage.setItem('dosei_products', JSON.stringify(defaultProducts));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
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
