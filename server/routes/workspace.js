const express = require('express');
const router = express.Router();

/**
 * 작업장 상세 정보 조회
 */
router.get('/', async (req, res) => {
  const { workspaceId } = req.query;
  try {
    res.json({
      name: workspaceId ? `Server Workspace [${workspaceId}]` : 'Jira Clone Server Workspace',
      creator: '서버 관리자',
      createdDate: '2024-01-01',
      description: 'Express 서버 연동 작업장입니다.',
      approvals: [
        { step: 1, type: '기안', user: '홍길동', status: 'Completed', date: '2024-04-28 09:00:00' }
      ],
      members: [
        { id: 1, name: '백엔드', role: 'Developer', dept: 'Server', email: 'backend@example.com' }
      ],
      registeredModels: [
        { code: 'SM-101', name: 'Server-v1.0', projectCode: 'P-SVR', projectName: '서버 연동 프로젝트', status: 'Active' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 모델 목록 조회
 */
router.get('/models', async (req, res) => {
  try {
    res.json([
      { id: 1, name: 'Web-v1.0', category: 'Frontend', owner: '김백엔', createdDate: '2024-01-01', description: 'Backend-connected v1.0' },
      { id: 2, name: 'Web-v1.1', category: 'Frontend', owner: '박서버', createdDate: '2024-03-15', description: 'Backend-connected v1.1' }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
