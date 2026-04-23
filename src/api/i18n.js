import { ref, computed } from 'vue';

// 1. 언어 상태 (기본값: KO)
export const currentLang = ref('KO');

// 2. 다국어 사전
const strings = {
  KO: {
    menu_issue: '이슈',
    menu_models: '모델 관리',
    menu_workspace: '작업장 정보',
    col_type: '유형',
    col_title: '제목',
    col_status: '상태',
    col_model: '모델',
    btn_create: '이슈 생성',
    label_lang: '언어 (Language)',
    logout: '로그아웃',
    status_todo: '할 일',
    status_inprogress: '진행 중',
    status_done: '완료'
  },
  EN: {
    menu_issue: 'Issues',
    menu_models: 'Models',
    menu_workspace: 'Workspace Info',
    col_type: 'Type',
    col_title: 'Title',
    col_status: 'Status',
    col_model: 'Model',
    btn_create: 'Create Issue',
    label_lang: 'Language',
    logout: 'Logout',
    status_todo: 'To Do',
    status_inprogress: 'In Progress',
    status_done: 'Done'
  }
};

// 3. 현재 언어에 맞는 문자열 반환 (Computed)
export const t = computed(() => strings[currentLang.value]);

// 4. 언어 변경 함수
export const setLang = (lang) => {
  currentLang.value = lang;
  console.log(`Language changed to: ${lang}`);
};
