import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dosei_db'
};

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT 
                p.id as internal_id,
                p.sku as id, 
                p.name, 
                p.price_mad as price_raw, 
                t.name as tag, 
                c.name as category_name,
                c.slug as category,
                p.description,
                GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order ASC SEPARATOR '||') as all_images,
                GROUP_CONCAT(CONCAT(s.size_label, ':', ps.stock_quantity)) as stock_info
            FROM products p
            LEFT JOIN tags t ON p.tag_id = t.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN product_sizes ps ON p.id = ps.product_id
            LEFT JOIN sizes s ON ps.size_id = s.id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);

        const products = rows.map(p => {
            const stockMap = {};
            if (p.stock_info) {
                p.stock_info.split(',').forEach(item => {
                    const [size, qty] = item.split(':');
                    if (size) stockMap[size] = parseInt(qty);
                });
            }

            const totalStock = Object.values(stockMap).reduce((acc, curr) => acc + curr, 0);

            // Build full image URL array from all images
            const imageUrls = p.all_images
                ? p.all_images.split('||').map(url =>
                    url.startsWith('http') ? url : `http://localhost:3001${url}`
                )
                : [];

            return {
                ...p,
                price: `${p.price_raw} MAD`,
                images: imageUrls,
                stocks: stockMap,
                isOutOfStock: totalStock === 0
            };
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// CREATE PRODUCT WITH IMAGE UPLOAD
app.post('/api/products', upload.array('images'), async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const { sku, name, price, category, tag, description, stocks } = req.body;
        // stocks is expected as JSON string: {"S": 10, "M": 5}
        const stockData = JSON.parse(stocks || '{}');

        // Get category and tag IDs
        const [cats] = await connection.execute('SELECT id FROM categories WHERE slug = ? OR name = ?', [category, category]);
        const [tags] = await connection.execute('SELECT id FROM tags WHERE name = ?', [tag]);

        const category_id = cats[0]?.id || null;
        const tag_id = tags[0]?.id || null;

        const [result] = await connection.execute(
            'INSERT INTO products (sku, name, price_mad, category_id, tag_id, description) VALUES (?, ?, ?, ?, ?, ?)',
            [sku, name, price, category_id, tag_id, description]
        );
        const productId = result.insertId;

        // Save Images
        if (req.files) {
            for (const file of req.files) {
                const url = `/uploads/${file.filename}`;
                await connection.execute('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)', [productId, url]);
            }
        }

        // Save Stocks
        const [sizeList] = await connection.execute('SELECT id, size_label FROM sizes');
        for (const size of sizeList) {
            const qty = stockData[size.size_label] || 0;
            if (qty > 0) {
                await connection.execute('INSERT INTO product_sizes (product_id, size_id, stock_quantity) VALUES (?, ?, ?)', [productId, size.id, qty]);
            }
        }

        res.status(201).json({ message: 'Product created', id: sku });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// UPDATE PRODUCT (NOW SUPPORTS IMAGES)
app.put('/api/products/:sku', upload.array('images'), async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const { name, price, category, tag, description, stocks } = req.body;
        const sku = req.params.sku;
        const stockData = typeof stocks === 'string' ? JSON.parse(stocks) : stocks;

        const [cats] = await connection.execute('SELECT id FROM categories WHERE slug = ? OR name = ?', [category, category]);
        const [tags] = await connection.execute('SELECT id FROM tags WHERE name = ?', [tag]);
        const category_id = cats[0]?.id || null;
        const tag_id = tags[0]?.id || null;

        await connection.execute(
            'UPDATE products SET name = ?, price_mad = ?, category_id = ?, tag_id = ?, description = ? WHERE sku = ?',
            [name, price, category_id, tag_id, description, sku]
        );

        const [p] = await connection.execute('SELECT id FROM products WHERE sku = ?', [sku]);
        if (p.length > 0) {
            const productId = p[0].id;

            // Update Images (If new files uploaded)
            if (req.files && req.files.length > 0) {
                // Optional: For now we just ADD new images. To replace, uncomment:
                // await connection.execute('DELETE FROM product_images WHERE product_id = ?', [productId]);
                for (const file of req.files) {
                    const url = `/uploads/${file.filename}`;
                    await connection.execute('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)', [productId, url]);
                }
            }

            // Update Stocks
            await connection.execute('DELETE FROM product_sizes WHERE product_id = ?', [productId]);
            const [sizeList] = await connection.execute('SELECT id, size_label FROM sizes');
            for (const size of sizeList) {
                const qty = stockData[size.size_label] || 0;
                if (qty > 0) {
                    await connection.execute('INSERT INTO product_sizes (product_id, size_id, stock_quantity) VALUES (?, ?, ?)', [productId, size.id, qty]);
                }
            }
        }

        res.json({ message: 'Product updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// DELETE PRODUCT
app.delete('/api/products/:sku', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM products WHERE sku = ?', [req.params.sku]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// DELETE A SPECIFIC IMAGE
app.delete('/api/products/:sku/images', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const { imageUrl } = req.body;
        const sku = req.params.sku;

        // Get the product id
        const [p] = await connection.execute('SELECT id FROM products WHERE sku = ?', [sku]);
        if (p.length === 0) return res.status(404).json({ error: 'Product not found' });

        const productId = p[0].id;

        // Extract the relative path from the full URL if needed
        const relativeUrl = imageUrl.replace('http://localhost:3001', '');

        // Delete from DB
        await connection.execute(
            'DELETE FROM product_images WHERE product_id = ? AND image_url = ?',
            [productId, relativeUrl]
        );

        // Optionally delete the file from disk
        const filePath = path.join(__dirname, 'public', relativeUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.json({ message: 'Image deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server v2 running on http://localhost:${PORT}`);
});
