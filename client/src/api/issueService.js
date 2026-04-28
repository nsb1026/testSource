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
 * 응답 인터셉터 (로그 및 에러 처리 공통화)
 */
apiClient.interceptors.request.use((config) => {
  console.log(`%c🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, 'color: #0052cc; font-weight: bold;', {
    params: config.params,
    data: config.data,
    headers: config.headers
  });
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`%c✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} (${response.status})`, 'color: #00875a; font-weight: bold;', response.data);
    return response;
  },
  (error) => {
    console.error(`%c❌ [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, 'color: #de350b; font-weight: bold;', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const issueService = {
  
  /**
   * 이슈 목록 조회
   * GET /api/issues?page=0&size=30&workspaceId=...
   */
  async fetchIssues(page = 0, size = 30, workspaceId = null) {
    try {
      const response = await apiClient.get('/issues', {
        params: { page, size, workspaceId }
      });
      return response.data; // Spring/Express의 Page 객체
    } catch (error) {
      console.error('fetchIssues error:', error);
      return { content: [], totalPages: 0, totalElements: 0, number: 0, size };
    }
  },

  /**
   * 사용자 상세 정보 조회
   */
  async fetchUserInfo(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('fetchUserInfo error:', error);
      return { id: userId, name: '알 수 없는 사용자' };
    }
  },

  /**
   * 모델 목록 조회
   */
  async fetchModels(workspaceId = null) {
    try {
      const response = await apiClient.get('/workspace/models', { params: { workspaceId } });
      return response.data;
    } catch (error) {
      console.error('fetchModels error:', error);
      return [];
    }
  },

  /**
   * 작업장 상세 정보 조회
   */
  async fetchWorkspaceInfo(workspaceId = null) {
    try {
      const response = await apiClient.get('/workspace', { params: { workspaceId } });
      return response.data;
    } catch (error) {
      console.error('fetchWorkspaceInfo error:', error);
      return null;
    }
  },

  /**
   * 사용자 검색
   */
  async searchUsers(query) {
    try {
      const response = await apiClient.get('/users', { params: { query } });
      return response.data;
    } catch (error) {
      console.error('searchUsers error:', error);
      return [];
    }
  },

  async updateIssueDetails(id, data) {
    return this.updateIssue(id, data);
  },

  async updateIssueStatus(id, status) {
    try {
      const response = await apiClient.put(`/issues/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async addComment(issueId, content) {
    try {
      const response = await apiClient.post(`/issues/${issueId}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteComment(issueId, commentId) {
    try {
      await apiClient.delete(`/issues/${issueId}/comments/${commentId}`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * 이슈 생성
   */
  async createIssue(data) {
    try {
      const response = await apiClient.post('/issues', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 이슈 수정
   */
  async updateIssue(id, data) {
    try {
      const response = await apiClient.put(`/issues/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
