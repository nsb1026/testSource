<template>
  <div class="model-detail-container" v-if="model">
    <!-- 헤더 영역 (Issue와 동일한 스타일) -->
    <div class="detail-header">
      <div class="breadcrumb">Models / {{ model.name }}</div>
    </div>
    
    <div class="content-body">
      <!-- 기본 정보 바 -->
      <div class="info-banner">
        <div class="info-item"><label>카테고리:</label> <span class="type-tag">{{ model.category }}</span></div>
        <div class="info-item"><label>담당자:</label> <span>{{ model.owner }}</span></div>
        <div class="info-item"><label>등록일:</label> <span>{{ model.createdDate }}</span></div>
      </div>

      <h1 class="model-title">{{ model.name }}</h1>

      <!-- 상세 내용 섹션 -->
      <div class="section">
        <h3>모델 설명</h3>
        <div class="rich-view">
          {{ model.description || '상세 설명이 등록되지 않았습니다.' }}
        </div>
      </div>

      <!-- 과제 정보 섹션 (샘플) -->
      <div class="section">
        <h3>관련 과제 정보</h3>
        <div class="info-grid-box">
          <div class="info-field"><label>과제 코드</label> <span>P-SAMPLE-001</span></div>
          <div class="info-field"><label>과제명</label> <span>차세대 통합 이슈 트래커 구축 프로젝트</span></div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="empty-detail" v-else>
    <p>모델을 선택하면 상세 내용을 확인할 수 있습니다.</p>
  </div>
</template>

<script setup>
defineProps({ model: Object });
</script>

<style scoped>
.model-detail-container { flex: 1; display: flex; flex-direction: column; background: #ffffff; overflow-y: auto; }

/* 헤더 & 브레드크럼 */
.detail-header { padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; background-color: var(--pale-blue); border-bottom: 1px solid var(--border-blue); }
.breadcrumb { font-size: 14px; color: var(--primary-blue); font-weight: 600; }

/* 본문 레이아웃 */
.content-body { padding: 24px 32px 32px; }

.info-banner { display: flex; gap: 24px; padding: 14px 20px; background: var(--soft-blue); border: 1px solid var(--border-blue); border-radius: 4px; margin-bottom: 32px; font-size: 13px; }
.info-item label { font-weight: 700; color: var(--dark-blue); margin-right: 8px; }
.type-tag { background: var(--primary-blue); color: white; padding: 2px 8px; border-radius: 3px; font-weight: 700; font-size: 11px; }

.model-title { font-size: 26px; color: var(--dark-blue); margin-bottom: 24px; font-weight: 700; }

.section { margin-bottom: 32px; }
.section h3 { font-size: 16px; margin-bottom: 12px; color: var(--dark-blue); border-bottom: 2px solid var(--border-blue); padding-bottom: 8px; font-weight: 700; }

.rich-view { padding: 16px; background: #ffffff; border: 1px solid var(--border-blue); border-radius: 4px; min-height: 80px; font-size: 14px; line-height: 1.6; color: var(--text-dark); }

.info-grid-box { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px; background: var(--pale-blue); border: 1px solid var(--border-blue); border-radius: 4px; }
.info-field label { display: block; font-size: 11px; font-weight: 700; color: #5e6c84; margin-bottom: 4px; text-transform: uppercase; }
.info-field span { font-size: 14px; color: var(--text-dark); font-weight: 500; }

.empty-detail { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); font-weight: 600; }
</style>
