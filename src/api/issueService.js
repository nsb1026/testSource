import axios from 'axios';

/**
 * Axios 인스턴스 보안 설정
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 환경 변수 사용 권장
  timeout: 5000, // 5초 타임아웃 설정 (보안 및 UX)
  headers: {
    'Content-Type': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest' // CSRF 방지용 커스텀 헤더 예시
  },
});

/**
 * 응답 인터셉터 (에러 처리 공통화)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 통신 에러:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const issueService = {
  
  /**
   * 이슈 목록 조회 (Spring Boot 연동 샘플)
   * GET /api/issues?page=0&size=30
   */
  async fetchIssues(page = 0, size = 30) {
    try {
      console.log(`[AJAX 호출] GET /api/issues?page=${page}&size=${size}`);
      
      // 실제 서버가 있을 경우 주석 해제하여 사용
      /*
      const response = await apiClient.get('/issues', {
        params: { page, size }
      });
      return response.data; // Spring의 Page<T> 객체가 리턴됨
      */

      // [Mock] 서버 미연동 시 테스트용 가짜 데이터 리턴 (Spring 데이터 구조)
      return new Promise((resolve) => {
        setTimeout(() => {
          const totalElements = 100;
          const issues = Array.from({ length: size }, (_, i) => ({
            id: page * size + i + 1,
            type: (i + 1) % 2 === 0 ? 'Problem' : 'TestRequest',
            title: `[서버 데이터] Spring 연동 샘플 이슈 ${page * size + i + 1}`,
            status: 'To Do',
            workspace: 'Jira Clone Workspace',
            workType: 'Bug',
            modelInfo: 'Web-v1.0',
            importance: 'B',
            frequency: 'One',
            assignees: [],
            description: '<p>서버에서 받아온 HTML 내용입니다.</p>',
            reproductionPath: '',
            comments: []
          }));

          resolve({
            content: issues,
            totalPages: Math.ceil(totalElements / size),
            totalElements,
            number: page,
            size
          });
        }, 500); // 네트워크 지연 시간 시뮬레이션
      });

    } catch (error) {
      // 에러 발생 시 빈 결과 또는 에러 객체 반환
      return { content: [], totalPages: 0, totalElements: 0, number: 0, size };
    }
  },

  /**
   * 모델 목록 조회
   */
  async fetchModels() {
    console.log('AJAX 요청: 모델 목록 조회');
    return [
      { id: 1, name: 'Web-v1.0', category: 'Frontend', owner: '김철수', createdDate: '2024-01-01', description: '메인 프론트엔드 v1.0 모델' },
      { id: 2, name: 'Web-v1.1', category: 'Frontend', owner: '박지민', createdDate: '2024-03-15', description: '업데이트된 프론트엔드 v1.1 모델' },
      { id: 3, name: 'Backend-Node', category: 'Backend', owner: '최현우', createdDate: '2023-12-10', description: '공통 API 서버 모델' }
    ];
  },

  /**
   * 작업장 상세 정보 조회
   */
  async fetchWorkspaceInfo() {
    console.log('AJAX 요청: 작업장 상세 정보 조회');
    return {
      name: 'Jira Clone Workspace',
      creator: '관리자',
      createdDate: '2024-01-01',
      description: '웹 서비스 통합 관리를 위한 개발 전용 작업장입니다.',
      approvals: [
        { step: 1, type: '기안', user: '홍길동', status: 'Completed', date: '2024-01-01 09:00:00' },
        { step: 2, type: '합의', user: '이합의', status: 'Completed', date: '2024-01-02 14:30:00' },
        { step: 3, type: '결재', user: '최팀장', status: 'Completed', date: '2024-01-02 17:00:00' },
        { step: 4, type: '결재', user: '박본부', status: 'Pending', date: '-' }
      ],
      members: [
        { id: 1, name: '김철수', role: 'Developer', dept: 'S/W', email: 'chul@example.com' },
        { id: 2, name: '이영희', role: 'Designer', dept: 'Design', email: 'young@example.com' },
        { id: 3, name: '박지민', role: 'Developer', dept: 'S/W', email: 'jimin@example.com' }
      ],
      registeredModels: [
        { code: 'M-101', name: 'Web-v1.0', projectCode: 'P-AAA', projectName: '차세대 웹 고도화', projectPL: '장PL', status: 'Active', description: '메인 프론트엔드 v1.0 모델입니다.' },
        { code: 'M-102', name: 'Web-v1.1', projectCode: 'P-AAA', projectName: '차세대 웹 고도화', projectPL: '장PL', status: 'In Review', description: '보안 패치가 적용된 v1.1 모델입니다.' },
        { code: 'M-201', name: 'Backend-Node', projectCode: 'P-BBB', projectName: '공통 API 서버 구축', projectPL: '강PL', status: 'Draft', description: 'Node.js 기반 공통 백엔드 모델입니다.' }
      ]
    };
  },

  /**
   * 사용자 검색
   */
  async searchUsers(query) {
    const users = [
      { id: 101, name: '김철수', department: 'S/W' },
      { id: 201, name: '박지민', department: 'S/W' },
      { id: 202, name: '최현우', department: 'S/W' },
      { id: 203, name: '정소연', department: '회로' },
      { id: 204, name: '강동원', department: '기구' },
    ];
    return users.filter(u => u.name.includes(query));
  },

  async updateIssueDetails(id, data) {
    console.log(`AJAX 요청: 이슈 저장`, data);
    return { success: true, updatedData: data };
  },

  async updateIssueStatus(id, status) {
    console.log(`AJAX 요청: 상태 변경 -> ${status}`);
    return { success: true, newStatus: status };
  },

  async addComment(issueId, content) {
    return { success: true, comment: { id: Date.now(), author: 'Current User', content, date: new Date().toISOString().split('T')[0] } };
  },

  async deleteComment(issueId, commentId) {
    return { success: true };
  }
};
