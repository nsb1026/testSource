const express = require('express');
const router = express.Router();

/**
 * 사용자 검색
 */
router.get('/', async (req, res) => {
  const { query } = req.query;
  try {
    const users = [
      { id: 101, name: '김철수', department: 'S/W' },
      { id: 201, name: '박지민', department: 'S/W' }
    ];
    res.json(users.filter(u => u.name.includes(query || '')));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
