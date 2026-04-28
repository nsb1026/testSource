const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * 1. 이슈 목록 조회 (Pagination & Join)
 */
router.get('/', async (req, res) => {
  const { page = 0, size = 30, workspaceId } = req.query;
  const offset = parseInt(page) * parseInt(size);

  try {
    // 이슈 목록 조회 (모델 정보 포함)
    const [rows] = await db.query(`
      SELECT i.*, m.name as modelInfo 
      FROM issues i 
      LEFT JOIN models m ON i.model_id = m.id 
      WHERE i.workspace_id = ? 
      ORDER BY i.created_at DESC 
      LIMIT ? OFFSET ?
    `, [workspaceId, parseInt(size), offset]);

    // 전체 개수 조회
    const [totalRows] = await db.query(`
      SELECT COUNT(*) as totalElements FROM issues WHERE workspace_id = ?
    `, [workspaceId]);

    const totalElements = totalRows[0].totalElements;

    res.json({
      content: rows,
      totalPages: Math.ceil(totalElements / size),
      totalElements,
      number: parseInt(page),
      size: parseInt(size)
    });
  } catch (error) {
    console.error('Fetch issues error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. 이슈 생성
 */
router.post('/', async (req, res) => {
  const {
    workspace_id,
    type,
    title,
    status = 'To Do',
    work_type,
    model_id,
    importance,
    frequency,
    description,
    reproduction_path
  } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO issues (
        workspace_id, type, title, status, work_type, 
        model_id, importance, frequency, description, reproduction_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      workspace_id, type, title, status, work_type, 
      model_id, importance, frequency, description, reproduction_path
    ]);

    res.json({ 
      success: true, 
      id: result.insertId,
      message: '이슈가 성공적으로 생성되었습니다.' 
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 3. 이슈 수정
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  // 수정 가능한 필드 제한 (보안 및 무결성)
  const allowedFields = [
    'title', 'status', 'work_type', 'importance', 
    'frequency', 'description', 'reproduction_path'
  ];
  
  const sets = [];
  const values = [];

  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      sets.push(`${key} = ?`);
      values.push(updateData[key]);
    }
  });

  if (sets.length === 0) {
    return res.status(400).json({ error: '수정할 데이터가 없습니다.' });
  }

  values.push(id);

  try {
    await db.query(`
      UPDATE issues SET ${sets.join(', ')} WHERE id = ?
    `, values);

    res.json({ 
      success: true, 
      id, 
      message: '이슈가 성공적으로 수정되었습니다.' 
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
