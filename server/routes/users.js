const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * 사용자 검색 (목록)
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

/**
 * 특정 사용자 상세 조회
 * GET /api/users/:id
 */
router.get('/:id', async (req, res) => {
  const { id } = params = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id, name, role, dept as department, email FROM users WHERE id = ?', 
      [id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
