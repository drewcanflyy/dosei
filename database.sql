-- DOSEI ARCHIVE DATABASE SCHEMA
-- Version 1.0.0

CREATE DATABASE IF NOT EXISTS dosei_db;
USE dosei_db;

-- 1. Categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 2. Tags (NEW, LIMITED, ARCHIVE, etc.)
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(20) NOT NULL UNIQUE, -- The ID shown in UI (e.g. 001, 002)
    name VARCHAR(100) NOT NULL,
    price_mad DECIMAL(10, 2) NOT NULL,
    category_id INT,
    tag_id INT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- 4. Product Images
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 5. Sizes
CREATE TABLE sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    size_label VARCHAR(10) NOT NULL UNIQUE -- S, M, L, XL, etc.
);

-- 6. Product Sizes (Many-to-Many)
CREATE TABLE product_sizes (
    product_id INT NOT NULL,
    size_id INT NOT NULL,
    stock_quantity INT DEFAULT 0,
    PRIMARY KEY (product_id, size_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES sizes(id) ON DELETE CASCADE
);

-- SEED DATA (INITIAL VALUES)
INSERT IGNORE INTO categories (name, slug) VALUES 
('Shirt', 'shirt'),
('Hoodie', 'hoodie'),
('Pants', 'pants'),
('Outerwear', 'outerwear'),
('Vinyl', 'vinyl'),
('Caps', 'caps');

INSERT IGNORE INTO tags (name) VALUES 
('NEW'), 
('HEAVYWEIGHT'), 
('LIMITED'), 
('ARCHIVE');

INSERT IGNORE INTO sizes (size_label) VALUES 
('S'), ('M'), ('L'), ('XL'), ('XXL'), ('XXXL');

-- EXAMPLE PRODUCTS SEED

-- 001: Asphalt Hoodie
INSERT IGNORE INTO products (sku, name, price_mad, category_id, tag_id) VALUES 
('001', 'Asphalt Hoodie', 850.00, 2, 2);
INSERT IGNORE INTO product_images (product_id, image_url, display_order) VALUES 
(1, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800', 1);
INSERT IGNORE INTO product_sizes (product_id, size_id, stock_quantity) VALUES 
(1, 1, 10), (1, 2, 15), (1, 3, 5);

-- 002: Static Tee
INSERT IGNORE INTO products (sku, name, price_mad, category_id, tag_id) VALUES 
('002', 'Static Tee', 450.00, 1, 3);
INSERT IGNORE INTO product_images (product_id, image_url, display_order) VALUES 
(2, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800', 1);
INSERT IGNORE INTO product_sizes (product_id, size_id, stock_quantity) VALUES 
(2, 2, 20), (2, 3, 20), (2, 4, 10);

-- 003: Tonal Cap
INSERT IGNORE INTO products (sku, name, price_mad, category_id, tag_id) VALUES 
('003', 'Tonal Cap', 320.00, 6, 1);
INSERT IGNORE INTO product_images (product_id, image_url, display_order) VALUES 
(3, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800', 1);
INSERT IGNORE INTO product_sizes (product_id, size_id, stock_quantity) VALUES 
(3, 1, 5);

-- 004: Raw Denim
INSERT IGNORE INTO products (sku, name, price_mad, category_id, tag_id) VALUES 
('004', 'Raw Denim', 1200.00, 3, 4);
INSERT IGNORE INTO product_images (product_id, image_url, display_order) VALUES 
(4, 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800', 1);
INSERT IGNORE INTO product_sizes (product_id, size_id, stock_quantity) VALUES 
(4, 3, 8), (4, 4, 8);

-- 005: Heavyweight Overshirt
INSERT IGNORE INTO products (sku, name, price_mad, category_id, tag_id) VALUES 
('005', 'Heavyweight Overshirt', 950.00, 4, 2);
INSERT IGNORE INTO product_images (product_id, image_url, display_order) VALUES 
(5, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800', 1);
INSERT IGNORE INTO product_sizes (product_id, size_id, stock_quantity) VALUES 
(5, 2, 12), (5, 3, 12);
