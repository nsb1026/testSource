<template>
  <TopBar :workspaceName="workspaceInfo?.name" :userName="userId || '홍길동'" />
  <div class="main-container">
    <!-- 사이드바: 메뉴 변경 및 현재 메뉴 상태 관리 -->
    <Sidebar :currentMenu="activeMenu" @change-menu="onChangeMenu" />
    
    <main class="content-area">
      <!-- 1. Issue 메뉴 (이슈 목록 및 상세) -->
      <template v-if="activeMenu === 'Issue'">
        <IssueList 
          :issues="issues" 
          :pagination="pagination"
          :selectedIssueId="selectedIssue?.id"
          @select-issue="onSelectIssue" 
          @create-new="onOpenCreateModal"
          @page-change="onPageChange"
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
    :loading="loading"
    @close="isFormModalOpen = false"
    @save="onSaveFromModal"
  />
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
import WorkspaceDetail from './components/workspace/WorkspaceDetail.vue';
import { issueService } from './api/issueService';

/**
 * 전역 상태 관리
 */
const activeMenu = ref('Issue'); // 현재 활성화된 메뉴
const issues = ref([]);         // 이슈 목록 (현재 페이지)
const pagination = ref({        // 페이징 정보
  totalPages: 0,
  totalElements: 0,
  number: 0,
  size: 30
});
const models = ref([]);         // 모델 목록
const workspaceInfo = ref(null); // 작업장 상세 정보

const selectedIssue = ref(null); // 선택된 이슈
const selectedModel = ref(null); // 선택된 모델

// JSP 연동을 위한 파라미터 상태
const workspaceId = ref(null);
const userId = ref(null);

// 모달 제어 상태 (누락된 변수 복구)
const isFormModalOpen = ref(false);
const formModalMode = ref('create');
const modalInitialData = ref({});
const loading = ref(false);

/**
 * 데이터 로드 함수 (페이징 지원)
 */
const loadIssues = async (page = 0) => {
  const pageData = await issueService.fetchIssues(page, pagination.value.size, workspaceId.value);
  issues.value = pageData.content;
  pagination.value = {
    totalPages: pageData.totalPages,
    totalElements: pageData.totalElements,
    number: pageData.number,
    size: pageData.size
  };
  
  // 첫 로딩이거나 현재 선택된 이슈가 목록에 없으면 첫 번째 아이템 선택
  if (issues.value.length > 0 && !selectedIssue.value) {
    selectedIssue.value = issues.value[0];
  }
};

onMounted(async () => {
  // 1. URL 파라미터 추출 (JSP GET 방식 대응)
  const params = new URLSearchParams(window.location.search);
  workspaceId.value = params.get('workspaceId');
  userId.value = params.get('userId');

  console.log('JSP 호출 파라미터:', { workspaceId: workspaceId.value, userId: userId.value });

  // 2. 초기 데이터 병렬 로드 (파라미터 전달)
  const [modelData, infoData] = await Promise.all([
    issueService.fetchModels(workspaceId.value),
    issueService.fetchWorkspaceInfo(workspaceId.value)
  ]);
  
  await loadIssues(0); // 이슈 첫 페이지 로드
  
  models.value = modelData;
  workspaceInfo.value = infoData;
  
  if (models.value.length > 0) selectedModel.value = models.value[0];
});

/**
 * 이벤트 핸들러
 */
const onPageChange = async (newPage) => {
  await loadIssues(newPage);
};

/**
 * 이벤트 핸들러
 */
const onChangeMenu = (menuName) => {
  activeMenu.value = menuName;
};

const onSelectIssue = (issue) => {
  selectedIssue.value = issue;
};
// 신규 생성 모달 열기
const onOpenCreateModal = () => {
  modalInitialData.value = {
    id: null,
    type: 'Problem', // 기본 유형
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


// 수정 모달 열기
const onOpenEditModal = (issue) => {
  modalInitialData.value = issue;
  formModalMode.value = 'edit';
  isFormModalOpen.value = true;
};

// 모달 저장 결과 처리
const onSaveFromModal = async (formData) => {
  loading.value = true;
  try {
    const response = await issueService.updateIssueDetails(formData.id, formData);
    if (response.success) {
      if (formData.id === null) {
        // Create: 목록에 추가
        const newIssue = { ...formData, id: Date.now() };
        issues.value.unshift(newIssue); // 최상단 추가
        selectedIssue.value = newIssue;
      } else {
        // Edit: 목록 데이터 업데이트
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

// 상세 화면에서의 부분 업데이트 (상태 변경 등) 수신
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
