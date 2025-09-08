// cart.js

const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const protect = require('../middleware/auth');

// -------------------- Add to Cart --------------------
router.post('/', protect, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity are required' });
  }
  try {
    // Check if the product already exists in user's cart
    const existing = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      // Update quantity instead of inserting
      const newQty = existing.rows[0].quantity + quantity;
      await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2',
        [newQty, existing.rows[0].id]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity, created_at) VALUES ($1, $2, $3, NOW())',
        [userId, productId, quantity]
      );
    }

    res.status(201).json({ message: 'Item added/updated in cart' });
  } catch (err) {
    console.error('Error adding/updating cart item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/test', (req, res) => {
  res.send('Cart route works!');
});


// -------------------- Get All Cart Items --------------------
router.get('/', protect, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT 
         ci.id,
         ci.quantity,
         json_build_object(
           'id', p.id,
           'name', p.title,
           'price', p.price,
           'image', p.image_url
         ) AS product
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cart items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Remove from Cart --------------------
router.delete('/:id', protect, async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  try {
    await pool.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [cartItemId, userId]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;