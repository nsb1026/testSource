<template>
  <div v-if="initError" class="init-error-container">
    <div class="error-card">
      <i class="error-icon">⚠️</i>
      <h2>접근 권한 또는 정보 부족</h2>
      <p>{{ initError }}</p>
    </div>
  </div>

  <template v-else-if="isInitialized">
    <TopBar :workspaceName="workspaceInfo?.name || '워크스페이스'" :userName="userInfo?.name || userId || 'Guest'" />
    <div class="main-container">
      <!-- 사이드바: 메뉴 변경 및 현재 메뉴 상태 관리 -->
      <Sidebar :currentMenu="activeMenu" @change-menu="onChangeMenu" />
      
      <main class="content-area" :class="{ 'full-width': activeMenu === 'Dashboard' || activeMenu === 'WorkspaceInfo' }">
        <!-- 0. Dashboard 메뉴 -->
        <template v-if="activeMenu === 'Dashboard'">
          <ModelDashboard 
            :workspaceId="workspaceId" 
            :models="models" 
            :allIssues="issues"
            @view-issues="onViewIssues" 
          />
        </template>
        <!-- 1. Issue 메뉴 (이슈 목록 및 상세) -->
        <template v-else-if="activeMenu === 'Issue'">
          <IssueList 
            :issues="issues" 
            :pagination="pagination"
            :selectedIssueId="selectedIssue?.id"
            :filterModel="filterModel"
            :filterType="filterType"
            :filterStatus="filterStatus"
            @select-issue="onSelectIssue" 
            @create-new="onOpenCreateModal"
            @page-change="onPageChange"
            @clear-filter="onClearFilters"
            @remove-filter="onRemoveFilter"
          />
          <IssueDetail 
            :issue="selectedIssue" 
            @open-edit="onOpenEditModal"
            @update-issue="onUpdateIssue"
          />
        </template>

        <!-- 2. Models 메뉴 (모델 목록 및 상세) -->
        <template v-else-if="activeMenu === 'Models'">
          <ModelList 
            :models="models" 
            :selectedModelId="selectedModel?.id"
            @select-model="selectedModel = $event" 
          />
          <ModelDetail :model="selectedModel" />
        </template>
        <!-- 3. 작업장 상세 정보 메뉴 -->
        <template v-else-if="activeMenu === 'WorkspaceInfo'">
          <WorkspaceDetail :info="workspaceInfo" />
        </template>
      </main>
    </div>

    <!-- 공통 이슈 입력/수정 모달 -->
    <IssueFormModal
      :isOpen="isFormModalOpen"
      :mode="formModalMode"
      :initialData="modalInitialData"
      :models="models"
      :loading="loading"
      @close="isFormModalOpen = false"
      @save="onSaveFromModal"
    />
  </template>

  <div v-else class="loading-container">
    <div class="spinner"></div>
    <p>워크스페이스 정보를 불러오는 중...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TopBar from './components/layout/TopBar.vue';
import Sidebar from './components/layout/Sidebar.vue';
import IssueList from './components/issue/IssueList.vue';
import IssueDetail from './components/issue/IssueDetail.vue';
import IssueFormModal from './components/issue/IssueFormModal.vue';
import ModelList from './components/model/ModelList.vue';
import ModelDetail from './components/model/ModelDetail.vue';
import ModelDashboard from './components/model/ModelDashboard.vue';
import WorkspaceDetail from './components/workspace/WorkspaceDetail.vue';
import { issueService } from './api/issueService';

/**
 * 전역 상태 관리
 */
const activeMenu = ref('Dashboard'); // 현재 활성화된 메뉴 (대시보드 기본)
const issues = ref([]);         // 이슈 목록 (현재 페이지)
const pagination = ref({        // 페이징 정보
  totalPages: 0,
  totalElements: 0,
  number: 0,
  size: 30
});
const models = ref([]);         // 모델 목록
const workspaceInfo = ref(null); // 작업장 상세 정보
const userInfo = ref(null);      // 사용자 상세 정보

const selectedIssue = ref(null); // 선택된 이슈
const selectedModel = ref(null); // 선택된 모델
const filterModel = ref(null);   // 이슈 목록 필터용 모델명
const filterType = ref(null);    // 이슈 유형 필터
const filterStatus = ref(null);  // 이슈 상태 필터

// JSP 연동을 위한 파라미터 상태
const workspaceId = ref(null);
const userId = ref(null);
const isInitialized = ref(false); // 초기화 완료 여부
const initError = ref(null);      // 초기화 에러 메시지

// 모달 제어 상태
const isFormModalOpen = ref(false);
const formModalMode = ref('create');
const modalInitialData = ref({});
const loading = ref(false);

/**
 * 데이터 로드 함수 (페이징 지원)
 */
const loadIssues = async (page = 0) => {
  try {
    const pageData = await issueService.fetchIssues(page, pagination.value.size, workspaceId.value);
    
    let content = pageData.content || [];
    
    // Mock 레벨에서 필터링 시뮬레이션
    if (filterModel.value) {
      content = content.map(issue => ({ ...issue, modelInfo: filterModel.value }));
    }
    if (filterType.value) {
      content = content.filter(issue => issue.type === filterType.value);
    }
    if (filterStatus.value) {
      content = content.filter(issue => issue.status === filterStatus.value);
    }

    issues.value = content;
    pagination.value = {
      totalPages: pageData.totalPages || 0,
      totalElements: content.length,
      number: page,
      size: pageData.size || 30
    };
    
    if (issues.value.length > 0) {
      selectedIssue.value = issues.value[0];
    } else {
      selectedIssue.value = null;
    }
  } catch (error) {
    console.error('loadIssues 에러:', error);
    throw error;
  }
};

/**
 * 전역 초기화 함수
 */
const initializeApp = async (data) => {
  const { wsId, uId } = data;
  
  if (!wsId) {
    initError.value = '워크스페이스 ID가 필요합니다.';
    return;
  }

  workspaceId.value = wsId;
  userId.value = uId;
  initError.value = null;

  try {
    loading.value = true;
    
    // 초기 데이터 병렬 로드 (사용자 정보 포함)
    const [modelData, infoData, userData] = await Promise.allSettled([
      issueService.fetchModels(workspaceId.value),
      issueService.fetchWorkspaceInfo(workspaceId.value),
      userId.value ? issueService.fetchUserInfo(userId.value) : Promise.resolve({ name: 'Guest' })
    ]);
    
    // 모델 데이터 로드 결과 처리
    let rawModels = [];
    if (modelData.status === 'fulfilled') rawModels = modelData.value;
    
    // 워크스페이스 정보 로드 결과 처리
    if (infoData.status === 'fulfilled') {
      workspaceInfo.value = infoData.value;
      // 별도 모델 호출이 실패했거나 데이터가 적을 경우 워크스페이스 내 모델 정보 활용
      if (rawModels.length === 0 && workspaceInfo.value?.registeredModels) {
        rawModels = workspaceInfo.value.registeredModels;
      }
    }

    // 사용자 정보 로드 결과 처리
    if (userData.status === 'fulfilled') {
      userInfo.value = userData.value;
    } else {
      userInfo.value = { name: userId.value || 'Guest' };
    }
    
    // 모델 데이터 표준화
    models.value = (rawModels || []).map(m => ({
      ...m,
      id: m.id || m.modelId,
      name: m.name || m.modelName || m.modelCode || 'Unknown Model'
    }));
    
    console.log('모델 로드 결과:', models.value);
    
    // 모델이 있으면 첫 번째 모델을 기본 선택
    if (models.value && models.value.length > 0) {
      selectedModel.value = models.value[0];
    }
    
    await loadIssues(0);
    isInitialized.value = true;
  } catch (error) {
    console.error('초기화 상세 오류:', error);
    initError.value = '데이터를 불러오는 중 오류가 발생했습니다. 서버 연결을 확인하세요.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const urlWsId = params.get('workspaceId');
  const urlUId = params.get('userId');

  if (urlWsId) {
    initializeApp({ wsId: urlWsId, uId: urlUId });
  } else {
    initError.value = 'URL 파라미터(workspaceId)가 누락되었습니다.';
  }

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'INIT_WORKSPACE') {
      initializeApp({ wsId: event.data.workspaceId, uId: event.data.userId });
    }
  });
});

/**
 * 이벤트 핸들러
 */
const onPageChange = async (newPage) => {
  await loadIssues(newPage);
};

const onChangeMenu = (menuName) => {
  activeMenu.value = menuName;
  if (menuName !== 'Issue') {
    filterModel.value = null;
    filterType.value = null;
    filterStatus.value = null;
  }
};

const onViewIssues = (modelName, type = null, status = null) => {
  filterModel.value = modelName;
  filterType.value = type;
  filterStatus.value = status;
  activeMenu.value = 'Issue';
  loadIssues(0);
};

const onClearFilters = () => {
  filterModel.value = null;
  filterType.value = null;
  filterStatus.value = null;
  loadIssues(0);
};

const onRemoveFilter = (key) => {
  if (key === 'model') filterModel.value = null;
  else if (key === 'type') filterType.value = null;
  else if (key === 'status') filterStatus.value = null;
  loadIssues(0);
};

const onSelectIssue = (issue) => {
  selectedIssue.value = issue;
};

const onOpenCreateModal = () => {
  modalInitialData.value = {
    id: null,
    type: 'DEFECT',
    title: '',
    status: 'To Do',
    importance: 'B',
    frequency: 'Sometime',
    workspace: 'Jira Clone Workspace',
    workType: 'Bug',
    modelInfo: 'Web-v1.0',
    assignees: [],
    description: '',
    reproductionPath: '',
    testScenario: '',
    comments: []
  };
  formModalMode.value = 'create';
  isFormModalOpen.value = true;
};

const onOpenEditModal = (issue) => {
  modalInitialData.value = issue;
  formModalMode.value = 'edit';
  isFormModalOpen.value = true;
};

const onSaveFromModal = async (formData) => {
  loading.value = true;
  try {
    const response = await issueService.updateIssueDetails(formData.id, formData);
    if (response.success) {
      if (formData.id === null) {
        const newIssue = { ...formData, id: Date.now() };
        issues.value.unshift(newIssue);
        selectedIssue.value = newIssue;
      } else {
        const index = issues.value.findIndex(i => i.id === formData.id);
        if (index !== -1) {
          issues.value[index] = formData;
          selectedIssue.value = formData;
        }
      }
      isFormModalOpen.value = false;
    }
  } finally {
    loading.value = false;
  }
};

const onUpdateIssue = (updatedIssue) => {
  const index = issues.value.findIndex(i => i.id === updatedIssue.id);
  if (index !== -1) {
    issues.value[index] = updatedIssue;
    selectedIssue.value = updatedIssue;
  }
};
</script>

<style>
/* 전역 스타일은 main.css에서 관리 */
</style>
