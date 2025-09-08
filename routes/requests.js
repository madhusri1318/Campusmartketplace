const express = require('express');
const pool = require('../models/db');
const auth = require('../middleware/auth');
const router = express.Router();

// POST: Create a new request (buyer → seller)
router.post('/', auth, async (req, res) => {
  const { product_id } = req.body;

  try {
    // find seller of the product
    const productRes = await pool.query(
      'SELECT seller_id FROM products WHERE id = $1',
      [product_id]
    );

    if (productRes.rows.length === 0)
      return res.status(404).json({ message: 'Product not found' });

    const seller_id = productRes.rows[0].seller_id;

    // ❌ Prevent users from requesting their own product
    if (seller_id === req.user.id) {
      return res
        .status(400)
        .json({ message: 'You cannot request your own product' });
    }

    // Check if request already exists
    const existingReq = await pool.query(
      `SELECT * FROM requests WHERE buyer_id = $1 AND product_id = $2`,
      [req.user.id, product_id]
    );

    if (existingReq.rows.length > 0) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    // Insert request
    const newReq = await pool.query(
      `INSERT INTO requests (buyer_id, seller_id, product_id, status)
       VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [req.user.id, seller_id, product_id]
    );

    res.status(201).json(newReq.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Requests made by the logged-in user (buyer side)
router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.title, p.price, p.image_url, p.seller_id
       FROM requests r
       JOIN products p ON r.product_id = p.id
       WHERE r.buyer_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Requests received by the seller
router.get('/received', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.full_name AS buyer_name, p.title, p.price
       FROM requests r
       JOIN users u ON r.buyer_id = u.id
       JOIN products p ON r.product_id = p.id
       WHERE r.seller_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update request status (accept or reject)
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body; // expected: 'accepted' or 'rejected'

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    // ensure request exists
    const requestRes = await pool.query(
      'SELECT * FROM requests WHERE id = $1',
      [req.params.id]
    );

    if (requestRes.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const request = requestRes.rows[0];

    // ✅ only seller can update
    if (request.seller_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await pool.query(
      'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
