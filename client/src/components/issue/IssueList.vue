<template>
  <div class="issue-list-container">
    <!-- 헤더 영역 -->
    <div class="list-header">
      <div class="title-area">
        <h2>{{ t.menu_issue }}</h2>
        <span class="total-count" v-if="pagination.totalElements">({{ pagination.totalElements }})</span>
      </div>
      <button @click="$emit('create-new')" class="create-btn">+ {{ t.btn_create }}</button>
    </div>

    <!-- 필터 표시 바 -->
    <div class="filter-bar" v-if="filterModel || filterType || filterStatus">
      <div class="filter-tags">
        <span v-if="filterModel" class="filter-tag model" @click="$emit('remove-filter', 'model')" title="Remove model filter">
          {{ filterModel }} <i class="close-icon">✕</i>
        </span>
        <span v-if="filterType" class="filter-tag type" @click="$emit('remove-filter', 'type')" title="Remove type filter">
          {{ filterType }} <i class="close-icon">✕</i>
        </span>
        <span v-if="filterStatus" class="filter-tag status" @click="$emit('remove-filter', 'status')" title="Remove status filter">
          {{ filterStatus }} <i class="close-icon">✕</i>
        </span>
      </div>
      <button class="clear-all-btn" @click="$emit('clear-filter')" title="Clear All Filters">전체 해제</button>
    </div>

    <!-- 이슈 카드 리스트 영역 -->
    <div class="list-content">
      <div 
        v-for="issue in issues" 
        :key="issue.id" 
        class="issue-card"
        :class="{ selected: selectedIssueId === issue.id }"
        @click="$emit('select-issue', issue)"
      >
        <div class="issue-title">{{ issue.title }}</div>
        <div class="issue-model-info" v-if="issue.modelInfo">{{ issue.modelInfo }}</div>
        <div class="issue-meta">
          <span class="status-tag" :class="issue.status.toLowerCase().replace(' ', '-')">
            {{ issue.status }}
          </span>
          <span class="issue-id">ISSUE-{{ issue.id }}</span>
        </div>
      </div>
      
      <!-- 데이터가 없을 때 -->
      <div v-if="issues.length === 0" class="empty-list">
        {{ currentLang === 'KO' ? '이슈가 없습니다.' : 'No issues found.' }}
      </div>
    </div>

    <!-- 페이징 컨트롤 영역 -->
    <div class="pagination-footer" v-if="pagination.totalPages > 1">
      <button 
        :disabled="pagination.number === 0" 
        @click="$emit('page-change', pagination.number - 1)"
        class="page-btn"
      >
        &lt;
      </button>
      
      <span class="page-info">
        <strong>{{ pagination.number + 1 }}</strong> / {{ pagination.totalPages }}
      </span>

      <button 
        :disabled="pagination.number + 1 >= pagination.totalPages" 
        @click="$emit('page-change', pagination.number + 1)"
        class="page-btn"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { t, currentLang } from '../../api/i18n';

defineProps({
  issues: { type: Array, default: () => [] },
  pagination: { type: Object, default: () => ({ totalPages: 0, number: 0, totalElements: 0 }) },
  selectedIssueId: Number,
  filterModel: String,
  filterType: String,
  filterStatus: String
});

defineEmits(['select-issue', 'create-new', 'page-change', 'clear-filter', 'remove-filter']);
</script>

<style scoped>
.issue-list-container {
  width: 320px;
  border-right: 2px solid var(--border-blue);
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.list-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-blue);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--pale-blue);
}

.filter-bar {
  background-color: var(--soft-blue);
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-blue);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.filter-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  flex: 1;
}

.filter-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 10px;
  border: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  user-select: none;
}

.filter-tag:hover {
  filter: brightness(0.9);
  transform: translateY(-1px);
}

.filter-tag.model { background-color: white; color: var(--primary-blue); border-color: var(--border-blue); }
.filter-tag.type { background-color: var(--primary-blue); color: white; }
.filter-tag.status { background-color: #006644; color: white; }

.close-icon {
  font-style: normal;
  font-size: 8px;
  opacity: 0.7;
}

.clear-all-btn {
  background: none;
  border: none;
  color: #5e6c84;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  padding: 0;
}

.clear-all-btn:hover {
  color: var(--primary-blue);
  text-decoration: underline;
}

.title-area h2 { margin: 0; font-size: 16px; color: var(--dark-blue); font-weight: 700; }
.total-count { font-size: 12px; color: var(--primary-blue); font-weight: 600; margin-left: 6px; }

.create-btn { background-color: var(--primary-blue); color: white; border: none; padding: 6px 12px; border-radius: 3px; font-size: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 4px rgba(0, 82, 204, 0.2); }
.create-btn:hover { background-color: var(--dark-blue); }

.list-content { flex: 1; overflow-y: auto; background-color: #ffffff; }

.issue-card { padding: 14px 24px; border-bottom: 1px solid var(--soft-blue); cursor: pointer; transition: all 0.2s; border-left: 4px solid transparent; }
.issue-card:hover { background-color: var(--pale-blue); }
.issue-card.selected { 
  background-color: var(--light-blue); 
  border-left-color: var(--primary-blue);
}

.issue-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: var(--text-dark); line-height: 1.4; }
.issue-model-info { font-size: 11px; color: var(--primary-blue); font-weight: 700; margin-bottom: 8px; }
.issue-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-tag { font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; }
.status-tag.to-do { background: var(--border-blue); color: var(--dark-blue); }
.status-tag.in-progress { background: var(--primary-blue); color: white; }
.status-tag.done { background: #e3fcef; color: #006644; }

.issue-id { font-size: 11px; color: #8993a4; font-weight: 600; }

.empty-list { padding: 40px 20px; text-align: center; color: #5e6c84; font-size: 14px; }

.pagination-footer { padding: 12px 16px; border-top: 1px solid var(--border-blue); display: flex; justify-content: center; align-items: center; gap: 16px; background: var(--soft-blue); }
.page-btn { background: white; border: 1px solid var(--border-blue); border-radius: 4px; width: 30px; height: 30px; cursor: pointer; color: var(--primary-blue); font-weight: 800; display: flex; align-items: center; justify-content: center; }
.page-btn:disabled { background: var(--pale-blue); color: var(--border-blue); border-color: var(--soft-blue); cursor: not-allowed; }
.page-btn:not(:disabled):hover { background-color: var(--primary-blue); color: white; border-color: var(--primary-blue); }
.page-info { font-size: 12px; color: var(--dark-blue); font-weight: 700; }
</style>
