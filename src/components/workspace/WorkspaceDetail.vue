<template>
  <div class="workspace-detail-wrapper" v-if="info">
    <div class="detail-header">
      <div class="breadcrumb">Workspace / Details</div>
    </div>
    
    <div class="content-body">
      <div class="title-section">
        <h1>{{ info.name }}</h1>
        <p class="ws-desc">{{ info.description }}</p>
      </div>

      <!-- 1. 기본 정보 섹션 -->
      <div class="section">
        <div class="section-header clickable" @click="toggleSection('basic')">
          <h3>기본 정보</h3>
          <span class="fold-icon" :class="{ rotated: !visibility.basic }">▼</span>
        </div>
        <div class="section-content" v-if="visibility.basic">
          <div class="info-grid">
            <div class="info-item"><label>생성자</label> <span>{{ info.creator }}</span></div>
            <div class="info-item"><label>생성일</label> <span>{{ info.createdDate }}</span></div>
          </div>
        </div>
      </div>

      <!-- 2. 결재 정보 섹션 -->
      <div class="section">
        <div class="section-header clickable" @click="toggleSection('approval')">
          <h3>결재 정보</h3>
          <span class="fold-icon" :class="{ rotated: !visibility.approval }">▼</span>
        </div>
        <div class="section-content" v-if="visibility.approval">
          <div class="grid-container">
            <table class="grid-table">
              <thead>
                <tr>
                  <th width="100">구분</th>
                  <th>결재자</th>
                  <th width="150">상태</th>
                  <th width="200">결재 시간</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="step in info.approvals" :key="step.step">
                  <td><span class="type-tag" :class="step.type">{{ step.type }}</span></td>
                  <td><strong>{{ step.user }}</strong></td>
                  <td>
                    <span class="status-badge" :class="step.status.toLowerCase()">
                      {{ step.status === 'Completed' ? '결재 완료' : '대기 중' }}
                    </span>
                  </td>
                  <td class="date-cell">{{ step.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 3. 작업장 멤버 섹션 (그리드 형태로 개편) -->
      <div class="section">
        <div class="section-header clickable" @click="toggleSection('members')">
          <h3>작업장 멤버</h3>
          <span class="fold-icon" :class="{ rotated: !visibility.members }">▼</span>
        </div>
        <div class="section-content" v-if="visibility.members">
          <div class="grid-container">
            <table class="grid-table">
              <thead>
                <tr>
                  <th width="150">성명</th>
                  <th width="200">부서</th>
                  <th>역할</th>
                  <th>이메일</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in info.members" :key="member.id">
                  <td><strong>{{ member.name }}</strong></td>
                  <td>{{ member.dept }}</td>
                  <td><span class="role-tag">{{ member.role }}</span></td>
                  <td>{{ member.email }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 4. 등록된 모델 정보 섹션 -->
      <div class="section">
        <div class="section-header clickable" @click="toggleSection('models')">
          <h3>등록된 모델 정보</h3>
          <span class="fold-icon" :class="{ rotated: !visibility.models }">▼</span>
        </div>
        <div class="section-content" v-if="visibility.models">
          <div class="grid-container">
            <table class="grid-table">
              <thead>
                <tr>
                  <th width="120">모델 코드</th>
                  <th>모델 명</th>
                  <th width="120">과제코드</th>
                  <th>과제명</th>
                  <th width="100">과제 PL</th>
                  <th width="120">모델 상태</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="model in info.registeredModels" :key="model.code">
                  <td>
                    <a href="#" class="model-link" @click.prevent="openModelDetail(model)">
                      {{ model.code }}
                    </a>
                  </td>
                  <td>{{ model.name }}</td>
                  <td>{{ model.projectCode }}</td>
                  <td>{{ model.projectName }}</td>
                  <td>{{ model.projectPL }}</td>
                  <td>
                    <span class="status-badge" :class="model.status.toLowerCase().replace(' ', '-')">
                      {{ model.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 모델 상세 정보 레이어 -->
    <div class="modal-overlay" v-if="selectedModel" @click.self="selectedModel = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>모델 상세 정보 ({{ selectedModel.code }})</h3>
          <button @click="selectedModel = null" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-info-grid">
            <div class="info-field"><label>모델 코드</label> <span>{{ selectedModel.code }}</span></div>
            <div class="info-field"><label>모델 명</label> <span>{{ selectedModel.name }}</span></div>
            <div class="info-field"><label>과제 코드</label> <span>{{ selectedModel.projectCode }}</span></div>
            <div class="info-field"><label>과제 명</label> <span>{{ selectedModel.projectName }}</span></div>
            <div class="info-field"><label>과제 PL</label> <span>{{ selectedModel.projectPL }}</span></div>
            <div class="info-field"><label>상태</label> <span>{{ selectedModel.status }}</span></div>
          </div>
          <div class="info-section">
            <label>상세 설명</label>
            <div class="desc-content" v-html="selectedModel.description"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

defineProps({ info: Object });

const visibility = reactive({
  basic: true,
  approval: true,
  members: true,
  models: true
});

const selectedModel = ref(null);

const toggleSection = (section) => {
  visibility[section] = !visibility[section];
};

const openModelDetail = (model) => {
  selectedModel.value = model;
};
</script>

<style scoped>
.workspace-detail-wrapper { flex: 1; overflow-y: auto; background: white; }
.detail-header { padding: 16px 32px; border-bottom: 1px solid var(--border-blue); }
.breadcrumb { font-size: 14px; color: #5e6c84; }
.content-body { padding: 32px; max-width: 1200px; margin: 0 auto; }

.title-section { margin-bottom: 32px; }
.title-section h1 { font-size: 28px; color: var(--dark-blue); margin-bottom: 8px; }
.ws-desc { color: #5e6c84; font-size: 16px; }

.section { margin-bottom: 24px; border: 1px solid var(--border-blue); border-radius: 4px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }

.section-header { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 14px 24px; 
  background-color: var(--soft-blue); 
  cursor: pointer; 
  transition: all 0.2s; 
}
.section-header:hover { background-color: var(--light-blue); }
.section-header h3 { margin: 0; font-size: 16px; color: var(--dark-blue); font-weight: 700; }

.fold-icon { transition: transform 0.2s ease; color: var(--primary-blue); font-size: 12px; }
.fold-icon.rotated { transform: rotate(-90deg); }

.section-content { padding: 24px; border-top: 1px solid var(--border-blue); background: #ffffff; }

.info-grid { display: flex; gap: 60px; }
.info-item label { display: block; font-size: 12px; color: #5e6c84; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; }
.info-item span { font-size: 15px; color: var(--text-dark); font-weight: 500; }

/* Grid Table Unified Style */
.grid-table { width: 100%; border-collapse: collapse; border: 1px solid var(--border-blue); }
.grid-table th, .grid-table td { padding: 12px 16px; border: 1px solid var(--border-blue); text-align: left; font-size: 13px; }
.grid-table th { background: var(--soft-blue); color: var(--dark-blue); font-weight: 700; font-size: 12px; }
.grid-table tbody tr:hover { background-color: #fcfdff; }

.type-tag { padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 700; display: inline-block; }
.type-tag.기안 { background: #deebff; color: #0747a6; }
.type-tag.합의 { background: #fff0b3; color: #172b4d; }
.type-tag.결재 { background: #e3fcef; color: #006644; }

.role-tag { background: #f4f5f7; color: #42526e; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: 600; }

.status-badge { font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 12px; display: inline-block; }
.status-badge.completed { background: #e3fcef; color: #006644; }
.status-badge.pending { background: #fff0b3; color: #8d5e00; }
.status-badge.active { background: #deebff; color: #0747a6; }
.status-badge.in-review { background: #eae6ff; color: #403294; }

.model-link { color: var(--primary-blue); text-decoration: none; font-weight: 700; }
.model-link:hover { text-decoration: underline; color: var(--dark-blue); }

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(9, 30, 66, 0.54); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-content { background: white; width: 700px; border-radius: 4px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); overflow: hidden; }
.modal-header { padding: 18px 24px; border-bottom: 1px solid var(--border-blue); display: flex; justify-content: space-between; align-items: center; background: var(--soft-blue); }
.modal-header h3 { margin: 0; color: var(--dark-blue); }
.close-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: #5e6c84; }
.modal-body { padding: 32px; }
.modal-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
.info-field label { display: block; font-size: 11px; color: #5e6c84; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; }
.info-field span { font-size: 15px; color: var(--text-dark); }
.info-section label { display: block; font-size: 11px; color: #5e6c84; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; }
.desc-content { padding: 16px; background: var(--soft-blue); border: 1px solid var(--border-blue); border-radius: 4px; font-size: 14px; color: var(--text-dark); min-height: 100px; line-height: 1.6; }
</style>
