<template>
  <!-- 
    이슈 상세 화면 컴포넌트 
    - 이슈 유형(문제점/시험의뢰)에 따라 다른 메인 영역 구성을 보여줍니다.
    - 상태 변경, 댓글 작성, 수정 모달 열기 기능을 포함합니다.
  -->
  <div class="issue-detail-wrapper" v-if="issue">
    
    <!-- 좌측 메인 영역: 상세 내용 표시 -->
    <div class="main-content">
      <div class="detail-header">
        <div class="breadcrumb">Projects / Jira Clone / ISSUE-{{ issue.id }}</div>
        <div class="actions">
          <!-- 이슈 수정 버튼 (모달 열기) -->
          <button @click="$emit('open-edit', issue)" class="btn-edit" title="이슈 수정">
            <span class="edit-icon">✏️</span> Edit
          </button>
          
          <!-- 커스텀 상태 드롭다운 (Jira 스타일) -->
          <div class="custom-status-dropdown" v-click-outside="() => isStatusOpen = false">
            <div 
              class="status-trigger" 
              :class="issue.status.toLowerCase().replace(' ', '-')"
              @click="isStatusOpen = !isStatusOpen"
            >
              <span class="status-dot"></span>
              <span class="status-label">{{ issue.status }}</span>
              <span class="arrow-down">▼</span>
            </div>
            <!-- 상태 선택 목록 -->
            <div class="status-options" v-if="isStatusOpen">
              <div 
                v-for="opt in ['To Do', 'In Progress', 'Done']" 
                :key="opt"
                class="status-option"
                :class="opt.toLowerCase().replace(' ', '-')"
                @click="onStatusSelect(opt)"
              >
                <span class="status-dot"></span>
                {{ opt }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-body">
        <!-- 기본 상단 정보 바 (고정 정보) -->
        <div class="info-banner">
          <div class="info-item"><label>작업장:</label> <span>{{ issue.workspace }}</span></div>
          <div class="info-item"><label>업무 유형:</label> <span>{{ issue.workType }}</span></div>
          <div class="info-item"><label>유형:</label> <span class="type-tag">{{ issue.type === 'Problem' ? '문제점' : '시험의뢰' }}</span></div>
        </div>

        <h1 class="issue-title">{{ issue.title }}</h1>

        <!-- 담당자 정보 그리드 -->
        <div class="section">
          <h3>문제유형 / 해결담당자 정보</h3>
          <div class="assignee-grid">
            <table>
              <thead>
                <tr>
                  <th>성명</th>
                  <th>부서</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in issue.assignees" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.department }}</td>
                </tr>
                <tr v-if="!issue.assignees?.length">
                  <td colspan="2" class="empty-row">담당자가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 이슈 유형별 상세 구성 분기 -->
        
        <!-- Case 1: 문제점 (Problem) -->
        <template v-if="issue.type === 'Problem'">
          <div class="section">
            <h3>문제점</h3>
            <div class="rich-view" v-html="issue.description"></div>
          </div>

          <div class="section">
            <h3>발생/재현 경로</h3>
            <div class="rich-view" v-html="issue.reproductionPath"></div>
          </div>
        </template>

        <!-- Case 2: 시험의뢰 (TestRequest) -->
        <template v-else-if="issue.type === 'TestRequest'">
          <div class="test-meta-info">
            <div class="meta-item"><label>대상 버전:</label> {{ issue.targetVersion || '-' }}</div>
            <div class="meta-item"><label>의뢰 일자:</label> {{ issue.requestDate || '-' }}</div>
          </div>
          <div class="section">
            <h3>시험 시나리오</h3>
            <div class="rich-view" v-html="issue.testScenario || '내용 없음'"></div>
          </div>
        </template>

        <!-- 첨부 파일 영역 (Innorix 모듈 공간) -->
        <div class="section">
          <h3>첨부 파일</h3>
          <div class="innorix-container">
            <div id="innorix_placeholder">
              <p>Innorix File Uploader (View Mode)</p>
            </div>
          </div>
        </div>

        <!-- 댓글 영역 (최하단) -->
        <div class="section comments-section">
          <h3>Comments</h3>
          <div class="comment-list">
            <div v-for="comment in issue.comments" :key="comment.id" class="comment-item">
              <div class="comment-meta">
                <strong>{{ comment.author }}</strong> <span>{{ comment.date }}</span>
                <button @click="onDeleteComment(comment.id)" class="delete-link">Delete</button>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
            </div>
          </div>
          <!-- 새 댓글 입력창 -->
          <div class="comment-input-area">
            <textarea v-model="newComment" placeholder="Add a comment..." class="comment-textarea"></textarea>
            <button @click="onAddComment" class="btn primary" :disabled="!newComment.trim()">Add Comment</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 우측 사이드바: 메타 정보 요약 -->
    <div class="meta-sidebar">
      <div class="meta-group">
        <div class="meta-field"><label>사례코드</label> <span>CODE-1234</span></div>
        <div class="meta-field"><label>중요도</label> <span>{{ issue.importance }}</span></div>
        <div class="meta-field"><label>발생빈도</label> <span>{{ issue.frequency }}</span></div>
        <div class="meta-field"><label>발생단계</label> <span>{{ issue.phase || '-' }}</span></div>
        <div class="meta-field"><label>발생Block</label> <span>{{ issue.block || '-' }}</span></div>
        <div class="meta-field"><label>Feature</label> <span>{{ issue.feature || '-' }}</span></div>
        <div class="meta-field"><label>TC No</label> <span>{{ issue.tcNo || '-' }}</span></div>
      </div>
    </div>
  </div>
  
  <!-- 데이터가 없을 때 표시되는 빈 화면 -->
  <div class="empty-detail" v-else>
    <p>이슈를 선택하면 상세 내용을 확인할 수 있습니다.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { issueService } from '../../api/issueService';

/**
 * Props & Emits 정의
 */
const props = defineProps({
  issue: Object
});

const emit = defineEmits(['update-issue', 'open-edit']);

/**
 * 상태 관리 변수
 */
const loadingStatus = ref(false);
const newComment = ref('');
const isStatusOpen = ref(false);

/**
 * Click Outside Directive (커스텀 드롭다운 닫기용)
 */
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

/**
 * 상태 변경 핸들러 (AJAX 통신 포함)
 */
const onStatusSelect = async (newStatus) => {
  if (newStatus === props.issue.status) {
    isStatusOpen.value = false;
    return;
  }
  
  isStatusOpen.value = false;
  loadingStatus.value = true;
  try {
    const response = await issueService.updateIssueStatus(props.issue.id, newStatus);
    if (response.success) {
      // 부모 컴포넌트에 변경된 상태 알림
      emit('update-issue', { ...props.issue, status: newStatus });
    }
  } finally {
    loadingStatus.value = false;
  }
};

/**
 * 댓글 추가 핸들러
 */
const onAddComment = async () => {
  if (!newComment.value.trim()) return;
  const response = await issueService.addComment(props.issue.id, newComment.value);
  if (response.success) {
    const updatedIssue = { ...props.issue };
    if (!updatedIssue.comments) updatedIssue.comments = [];
    updatedIssue.comments.push(response.comment);
    emit('update-issue', updatedIssue);
    newComment.value = '';
  }
};

/**
 * 댓글 삭제 핸들러
 */
const onDeleteComment = async (commentId) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  const response = await issueService.deleteComment(props.issue.id, commentId);
  if (response.success) {
    const updatedIssue = { ...props.issue };
    updatedIssue.comments = updatedIssue.comments.filter(c => c.id !== commentId);
    emit('update-issue', updatedIssue);
  }
};
</script>

<style scoped>
/* 전체 상세 화면 레이아웃 */
.issue-detail-wrapper { flex: 1; display: flex; background: #ffffff; overflow: hidden; }

/* 메인 영역 스크롤 제어 */
.main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; border-right: 2px solid var(--border-blue); background-color: #ffffff; }

/* 헤더 & 브레드크럼 */
.detail-header { padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; background-color: var(--pale-blue); border-bottom: 1px solid var(--border-blue); }
.breadcrumb { font-size: 14px; color: var(--primary-blue); font-weight: 600; }

.actions { display: flex; align-items: center; gap: 16px; }

/* 커스텀 상태 드롭다운 스타일 */
.custom-status-dropdown { position: relative; min-width: 140px; }
.status-trigger {
  display: flex; align-items: center; gap: 8px; padding: 6px 12px;
  border-radius: 3px; font-weight: 700; font-size: 11px;
  text-transform: uppercase; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.status-dot { width: 8px; height: 8px; border-radius: 2px; }
.arrow-down { font-size: 8px; margin-left: auto; opacity: 0.6; }

/* 상태별 색상 (Jira 디자인 시스템 기준) */
.status-trigger.to-do, .status-option.to-do { background: var(--border-blue); color: var(--dark-blue); }
.status-trigger.to-do .status-dot, .status-option.to-do .status-dot { background: var(--dark-blue); }

.status-trigger.in-progress, .status-option.in-progress { background: var(--primary-blue); color: white; }
.status-trigger.in-progress .status-dot, .status-option.in-progress .status-dot { background: white; }

.status-trigger.done, .status-option.done { background: #e3fcef; color: #006644; }
.status-trigger.done .status-dot, .status-option.done .status-dot { background: #006644; }

.status-options {
  position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px;
  background: white; border-radius: 4px; box-shadow: 0 4px 12px rgba(0, 82, 204, 0.15);
  z-index: 100; overflow: hidden; border: 1px solid var(--border-blue);
}
.status-option {
  padding: 10px 12px; display: flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 700; text-transform: uppercase; cursor: pointer;
  border-bottom: 1px solid var(--pale-blue);
}
.status-option:hover { background-color: var(--soft-blue); }

/* Edit 버튼 스타일 */
.btn-edit {
  display: flex; align-items: center; gap: 6px;
  background: #ffffff; border: 1px solid var(--border-blue); border-radius: 3px;
  padding: 6px 16px; cursor: pointer; font-weight: 700; color: var(--primary-blue);
  transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.btn-edit:hover { background: var(--soft-blue); border-color: var(--primary-blue); }

/* 본문 컨텐츠 레이아웃 */
.content-body { padding: 24px 32px 32px; }
.info-banner { display: flex; gap: 24px; padding: 14px 20px; background: var(--soft-blue); border: 1px solid var(--border-blue); border-radius: 4px; margin-bottom: 32px; font-size: 13px; }
.info-item label { font-weight: 700; color: var(--dark-blue); margin-right: 8px; }
.type-tag { background: var(--primary-blue); color: white; padding: 2px 8px; border-radius: 3px; font-weight: 700; font-size: 11px; }

.issue-title { font-size: 26px; color: var(--dark-blue); margin-bottom: 24px; font-weight: 700; }

.section { margin-bottom: 32px; }
.section h3 { font-size: 16px; margin-bottom: 12px; color: var(--dark-blue); border-bottom: 2px solid var(--border-blue); padding-bottom: 8px; font-weight: 700; }

/* 담당자 테이블 스타일 */
.assignee-grid table { width: 100%; border-collapse: collapse; border: 1px solid var(--border-blue); }
.assignee-grid th, .assignee-grid td { padding: 12px; border: 1px solid var(--border-blue); text-align: left; font-size: 14px; }
.assignee-grid th { background: var(--soft-blue); color: var(--dark-blue); font-weight: 700; }

/* 에디터 결과물 뷰어 스타일 */
.rich-view { padding: 16px; background: #ffffff; border: 1px solid var(--border-blue); border-radius: 4px; min-height: 80px; font-size: 14px; line-height: 1.6; }
.rich-view :deep(img) { max-width: 100%; }

/* 시험의뢰 메타 정보 스타일 */
.test-meta-info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; padding: 16px; background: var(--soft-blue); border: 1px solid var(--border-blue); border-radius: 4px; }
.meta-item label { font-weight: 700; color: var(--dark-blue); margin-right: 8px; font-size: 13px; }

.innorix-container { height: 100px; border: 2px dashed var(--border-blue); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); background: var(--pale-blue); }

/* 댓글 섹션 스타일 */
.comment-item { margin-bottom: 16px; padding: 16px; background: #ffffff; border: 1px solid var(--border-blue); border-radius: 4px; }
.comment-meta { font-size: 12px; color: #5e6c84; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
.comment-meta strong { color: var(--dark-blue); font-size: 13px; }
.delete-link { background: none; border: none; color: #de350b; cursor: pointer; font-size: 12px; font-weight: 600; }
.comment-textarea { width: 100%; padding: 12px; border: 2px solid var(--border-blue); border-radius: 4px; margin-bottom: 8px; min-height: 80px; resize: vertical; background: white; }
.comment-textarea:focus { border-color: var(--primary-blue); outline: none; }

/* 우측 사이드바 스타일 */
.meta-sidebar { width: 280px; padding: 32px 24px; background-color: var(--pale-blue); }
.meta-field { margin-bottom: 20px; }
.meta-field label { display: block; font-size: 11px; font-weight: 700; color: var(--dark-blue); margin-bottom: 6px; text-transform: uppercase; }
.meta-field span { font-size: 14px; color: var(--text-dark); font-weight: 500; }

.btn.primary { background: var(--primary-blue); color: white; border: none; padding: 10px 20px; border-radius: 3px; cursor: pointer; font-weight: 700; box-shadow: 0 2px 4px rgba(0, 82, 204, 0.2); }
.btn.primary:hover { background: var(--dark-blue); }

.empty-detail { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); font-weight: 600; }
</style>
