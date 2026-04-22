<template>
  <div class="issue-list-container">
    <!-- 헤더 영역 -->
    <div class="list-header">
      <div class="title-area">
        <h2>Issues</h2>
        <span class="total-count" v-if="pagination.totalElements">({{ pagination.totalElements }})</span>
      </div>
      <button @click="$emit('create-new')" class="create-btn">+ Create</button>
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
        <div class="issue-meta">
          <span class="status-tag" :class="issue.status.toLowerCase().replace(' ', '-')">
            {{ issue.status }}
          </span>
          <span class="issue-id">ISSUE-{{ issue.id }}</span>
        </div>
      </div>
      
      <!-- 데이터가 없을 때 -->
      <div v-if="issues.length === 0" class="empty-list">
        이슈가 없습니다.
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
defineProps({
  issues: { type: Array, default: () => [] },
  pagination: { type: Object, default: () => ({ totalPages: 0, number: 0, totalElements: 0 }) },
  selectedIssueId: Number
});

defineEmits(['select-issue', 'create-new', 'page-change']);
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

.issue-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: var(--text-dark); line-height: 1.4; }

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

.pagination-footer { padding: 12px 16px; border-top: 1px solid var(--border-blue); display: flex; justify-content: center; align-items: center; gap: 16px; background: var(--soft-blue); }
.page-btn { background: white; border: 1px solid var(--border-blue); border-radius: 4px; width: 30px; height: 30px; cursor: pointer; color: var(--primary-blue); font-weight: 800; display: flex; align-items: center; justify-content: center; }
.page-btn:disabled { background: var(--pale-blue); color: var(--border-blue); border-color: var(--soft-blue); cursor: not-allowed; }
.page-btn:not(:disabled):hover { background-color: var(--primary-blue); color: white; border-color: var(--primary-blue); }
.page-info { font-size: 12px; color: var(--dark-blue); font-weight: 700; }
</style>
