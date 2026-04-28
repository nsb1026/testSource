const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * 1. 이슈 목록 조회 (Pagination)
 */
router.get('/', async (req, res) => {
  const { page = 0, size = 30, workspaceId } = req.query;
  const offset = page * size;

  try {
    const totalElements = 100;
    const issues = Array.from({ length: size }, (_, i) => ({
      id: parseInt(offset) + i + 1,
      type: (i + 1) % 2 === 0 ? 'DEFECT' : 'TEST_ITEM',
      title: `[${workspaceId || 'Default'}] 서버 이슈 ${parseInt(offset) + i + 1}`,
      status: 'To Do',
      workspace: workspaceId || 'Jira Clone Workspace',
      workType: 'Bug',
      modelInfo: 'Web-v1.0',
      importance: 'B',
      frequency: 'One',
      assignees: [],
      description: '<p>서버에서 온 데이터입니다.</p>',
      reproductionPath: '',
      comments: []
    }));

    res.json({
      content: issues,
      totalPages: Math.ceil(totalElements / size),
      totalElements,
      number: parseInt(page),
      size: parseInt(size)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. 이슈 생성
 */
router.post('/', async (req, res) => {
  const data = req.body;
  try {
    res.json({ success: true, data: { ...data, id: Math.floor(Math.random() * 1000) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 3. 이슈 수정
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    res.json({ success: true, id, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
