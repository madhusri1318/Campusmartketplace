const express = require('express');
const multer = require('multer');
const pool = require('../models/db');
const router = express.Router();
const path = require('path');
const auth = require('../middleware/auth'); // ✅ import auth

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST: Upload product (protected route)
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { title, description, price, category, condition } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newProduct = await pool.query(
      `INSERT INTO products (title, description, price, category, condition, image_url, seller_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, price, category, condition, imageUrl, req.user.id] // ✅ use logged-in user
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error("❌ Upload product error:", err.message);
    res.status(500).json({ error: 'Error uploading product' });
  }
});

// GET: All products
router.get('/', async (req, res) => {
  try {
    const products = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// GET: Product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching product' });
  }
});

module.exports = router;
