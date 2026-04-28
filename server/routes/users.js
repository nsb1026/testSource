const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * 사용자 검색
 */
router.get('/', async (req, res) => {
  const { query } = req.query;
  try {
    const [rows] = await db.query(
      'SELECT id, name, role, dept as department, email FROM users WHERE name LIKE ?', 
      [`%${query || ''}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
