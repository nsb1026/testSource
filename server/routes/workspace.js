const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * 작업장 상세 정보 조회 (복합 정보)
 */
router.get('/', async (req, res) => {
  const { workspaceId } = req.query;
  
  try {
    // 1. 기본 정보
    const [workspaces] = await db.query('SELECT * FROM workspaces WHERE id = ?', [workspaceId]);
    if (workspaces.length === 0) {
      return res.status(404).json({ error: '작업장을 찾을 수 없습니다.' });
    }
    const workspace = workspaces[0];

    // 2. 멤버 정보
    const [members] = await db.query(`
      SELECT u.id, u.name, u.role, u.dept, u.email 
      FROM users u
      JOIN workspace_members wm ON u.id = wm.user_id
      WHERE wm.workspace_id = ?
    `, [workspaceId]);

    // 3. 결재 정보
    const [approvals] = await db.query(`
      SELECT a.*, u.name as user 
      FROM approvals a
      JOIN users u ON a.user_id = u.id
      WHERE a.workspace_id = ?
      ORDER BY a.step ASC
    `, [workspaceId]);

    // 4. 등록 모델 정보
    const [registeredModels] = await db.query(`
      SELECT * FROM models WHERE workspace_id = ?
    `, [workspaceId]);

    res.json({
      ...workspace,
      members,
      approvals,
      registeredModels
    });
  } catch (error) {
    console.error('Fetch workspace error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 모델 목록 조회
 */
router.get('/models', async (req, res) => {
  const { workspaceId } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM models WHERE workspace_id = ?', [workspaceId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
