// routes/users.js

const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/auth');

router.put('/profile', authMiddleware, async (req, res) => {
  const { name, phone, year, gender } = req.body;
  const userId = req.user.id; // ✅ Consistent with JWT payload

  try {
    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Validate input fields (basic)
    if (!name || !phone || !year || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Update user details
    const updatedUser = await pool.query(
      `UPDATE users 
       SET full_name = $1, phone = $2, year = $3, gender = $4 
       WHERE id = $5 
       RETURNING id, full_name, email, phone, year, gender`,
      [name, phone, year, gender, userId]
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error while updating profile' });
  }
});

// ✅ Get Profile
router.get('/profile', authMiddleware, async (req, res) => {
  const userId = req.user.id; // ✅ Consistent with JWT payload

  try {
    const userResult = await pool.query(
      'SELECT id, full_name, email, phone, year, gender FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Rename full_name to name for frontend
    const user = userResult.rows[0];
    res.status(200).json({
      id: user.id,
      name: user.full_name,
      email: user.email,
      phone: user.phone,
      year: user.year,
      gender: user.gender,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error while fetching profile' });
  }
});

module.exports = router;