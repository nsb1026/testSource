<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2>{{ t.menu_dashboard }}</h2>
      <div class="header-actions">
        <span class="last-updated">최근 업데이트: {{ lastUpdated }}</span>
        <button class="refresh-btn" @click="fetchDashboardData">🔄 새로고침</button>
      </div>
    </div>

    <div class="dashboard-grid" v-if="!loading">
      <div v-for="model in dashboardData" :key="model.modelName" class="model-stat-card">
        <div class="card-header">
          <div class="model-info">
            <span class="model-icon">📱</span>
            <span class="model-name">{{ model.modelName }}</span>
          </div>
          <span class="total-badge">Total: {{ model.total }}</span>
        </div>

        <div class="stat-sections">
          <!-- 시험의뢰 섹션 -->
          <div class="stat-group">
            <div class="group-title">
              <span class="type-indicator test-request"></span>
              시험의뢰 (TEST_ITEM)
            </div>
            <div class="status-counters">
              <div class="counter-item clickable" @click="$emit('view-issues', model.modelName, 'TEST_ITEM', 'To Do')">
                <span class="count-label">To Do</span>
                <span class="count-value">{{ model.testRequest.todo }}</span>
              </div>
              <div class="counter-item clickable" @click="$emit('view-issues', model.modelName, 'TEST_ITEM', 'In Progress')">
                <span class="count-label">In Progress</span>
                <span class="count-value highlight">{{ model.testRequest.inprogress }}</span>
              </div>
              <div class="counter-item clickable" @click="$emit('view-issues', model.modelName, 'TEST_ITEM', 'Done')">
                <span class="count-label">Done</span>
                <span class="count-value">{{ model.testRequest.done }}</span>
              </div>
            </div>
          </div>

          <!-- 문제점 섹션 -->
          <div class="stat-group">
            <div class="group-title">
              <span class="type-indicator problem"></span>
              문제점 (DEFECT)
            </div>
            <div class="status-counters">
              <div class="counter-item clickable" @click="$emit('view-issues', model.modelName, 'DEFECT', 'To Do')">
                <span class="count-label">To Do</span>
                <span class="count-value">{{ model.problem.todo }}</span>
              </div>
              <div class="counter-item clickable" @click="$emit('view-issues', model.modelName, 'DEFECT', 'In Progress')">
                <span class="count-label">In Progress</span>
                <span class="count-value highlight">{{ model.problem.inprogress }}</span>
              </div>
              <div class="counter-item clickable" @click="$emit('view-issues', model.modelName, 'DEFECT', 'Done')">
                <span class="count-label">Done</span>
                <span class="count-value">{{ model.problem.done }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <button class="detail-link" @click="$emit('view-issues', model.modelName)">
            관련 이슈 보기 &rarr;
          </button>
        </div>
      </div>
    </div>

    <div v-else class="loading-state">
      데이터를 불러오는 중...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { t } from '../../api/i18n';

const props = defineProps({
  workspaceId: String,
  models: {
    type: Array,
    default: () => []
  },
  allIssues: {
    type: Array,
    default: () => []
  }
});

defineEmits(['view-issues']);

const loading = ref(false);
const dashboardData = ref([]);
const lastUpdated = ref('');

const calculateDashboardData = () => {
  if (!props.models || props.models.length === 0) {
    dashboardData.value = [];
    return;
  }
  
  loading.value = true;
  
  // 실제 이슈 데이터를 기반으로 통계 계산
  dashboardData.value = props.models.map(m => {
    // 해당 모델의 이슈들만 필터링
    const modelIssues = props.allIssues.filter(issue => 
      issue.modelInfo === m.name || issue.modelCode === m.id
    );

    const getCount = (type, status) => {
      return modelIssues.filter(i => i.type === type && i.status === status).length;
    };

    return {
      modelName: m.name,
      total: modelIssues.length,
      testRequest: {
        todo: getCount('TEST_ITEM', 'To Do'),
        inprogress: getCount('TEST_ITEM', 'In Progress'),
        done: getCount('TEST_ITEM', 'Done')
      },
      problem: {
        todo: getCount('DEFECT', 'To Do'),
        inprogress: getCount('DEFECT', 'In Progress'),
        done: getCount('DEFECT', 'Done')
      }
    };
  });
  
  lastUpdated.value = new Date().toLocaleTimeString();
  loading.value = false;
};

// models나 issues가 변경되면 다시 계산
watch([() => props.models, () => props.allIssues], () => {
  calculateDashboardData();
}, { immediate: true, deep: true });

onMounted(() => {
  calculateDashboardData();
});
</script>

<style scoped>
.dashboard-container {
  padding: 24px 32px;
  background-color: #f4f5f7;
  height: 100%;
  overflow-y: auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h2 {
  font-size: 22px;
  color: var(--dark-blue);
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.last-updated {
  font-size: 13px;
  color: #5e6c84;
}

.refresh-btn {
  background: white;
  border: 1px solid var(--border-blue);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  color: var(--primary-blue);
  font-weight: 600;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: var(--soft-blue);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.model-stat-card {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--border-blue);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.model-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--soft-blue);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--pale-blue);
  border-radius: 8px 8px 0 0;
}

.model-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.model-icon {
  font-size: 20px;
}

.model-name {
  font-weight: 700;
  color: var(--dark-blue);
  font-size: 16px;
}

.total-badge {
  background: var(--primary-blue);
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.stat-sections {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-title {
  font-size: 14px;
  font-weight: 700;
  color: #172b4d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.type-indicator.test-request { background-color: #0052cc; }
.type-indicator.problem { background-color: #de350b; }

.status-counters {
  display: flex;
  justify-content: space-between;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
}

.counter-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.counter-item.clickable {
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.counter-item.clickable:hover {
  background-color: var(--light-blue);
}

.count-label {
  font-size: 11px;
  color: #5e6c84;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.count-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark-blue);
}

.count-value.highlight {
  color: var(--primary-blue);
}

.card-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--soft-blue);
  text-align: right;
}

.detail-link {
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.detail-link:hover {
  text-decoration: underline;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--primary-blue);
  font-weight: 600;
}
</style>
