<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h3>{{ mode === 'create' ? t.modal_title_create : t.modal_title_edit }}</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>

      <div class="modal-body">
        <!-- 상단 고정 정보 바 -->
        <div class="info-banner">
          <div class="info-item"><label>{{ t.label_workspace }}:</label> <span>{{ form.workspace }}</span></div>
          <div class="info-item">
            <label>{{ t.col_model }}:</label>
            <select v-model="form.modelInfo" class="type-select" :disabled="mode === 'edit'">
              <option v-for="m in models" :key="m.id" :value="m.name">{{ m.name }}</option>
            </select>
          </div>
          <div class="info-item"><label>{{ t.label_work_type }}:</label> <span>{{ form.workType }}</span></div>
          <div class="info-item">
            <label>{{ t.label_type }}:</label>
            <select v-model="form.type" class="type-select" :disabled="mode === 'edit'">
              <option value="Problem">{{ t.label_problem }}</option>
              <option value="TestRequest">{{ t.label_test_request }}</option>
            </select>
          </div>
        </div>

        <div class="form-layout">
          <!-- 좌측: 주요 입력 영역 -->
          <div class="form-main">
            <!-- 담당자 관리 섹션 -->
            <div class="form-section">
              <label class="section-label">{{ t.label_assignee_info }}</label>
              <div class="assignee-controls">
                <select v-model="problemType" class="type-dropdown">
                  <option value="S/W">S/W</option>
                  <option value="회로">회로</option>
                  <option value="기구">기구</option>
                </select>
                <div class="btn-group">
                  <button @click="isUserModalOpen = true" class="btn secondary small">{{ t.label_add_assignee }}</button>
                  <button @click="removeSelectedAssignees" class="btn danger small">{{ t.label_delete }}</button>
                </div>
              </div>
              <div class="assignee-grid">
                <table>
                  <thead>
                    <tr>
                      <th width="40"><input type="checkbox" @change="toggleAllAssignees" /></th>
                      <th>{{ t.label_name }}</th>
                      <th>{{ t.label_dept }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in form.assignees" :key="user.id">
                      <td><input type="checkbox" v-model="selectedAssigneeIds" :value="user.id" /></td>
                      <td>{{ user.name }}</td>
                      <td>{{ user.department }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 제목 입력 -->
            <div class="form-section">
              <label class="section-label">{{ t.label_title }}</label>
              <input v-model="form.title" class="title-input" :placeholder="t.label_title_placeholder" />
            </div>

            <!-- 유형별 에디터 분기 -->
            <template v-if="form.type === 'Problem'">
              <div class="form-section">
                <label class="section-label">{{ t.label_problem }}</label>
                <div class="quill-wrapper">
                  <QuillEditor v-model:content="form.description" contentType="html" theme="snow" />
                </div>
              </div>
              <div class="form-section">
                <label class="section-label">{{ t.label_reproduction }}</label>
                <div class="quill-wrapper">
                  <QuillEditor v-model:content="form.reproductionPath" contentType="html" theme="snow" />
                </div>
              </div>
            </template>

            <template v-else-if="form.type === 'TestRequest'">
              <div class="form-grid-2">
                <div class="form-section">
                  <label class="section-label">{{ t.label_target_version }}</label>
                  <input v-model="form.targetVersion" class="full-input" />
                </div>
                <div class="form-section">
                  <label class="section-label">{{ t.label_request_date }}</label>
                  <input type="date" v-model="form.requestDate" class="full-input" :disabled="mode === 'edit'" />
                </div>
              </div>
              <div class="form-section">
                <label class="section-label">{{ t.label_test_scenario }}</label>
                <div class="quill-wrapper">
                  <QuillEditor v-model:content="form.testScenario" contentType="html" theme="snow" />
                </div>
              </div>
            </template>

            <!-- Innorix 파일 첨부 영역 -->
            <div class="form-section">
              <label class="section-label">{{ t.label_attachments }} (Innorix)</label>
              <div class="innorix-box">Innorix 파일 업로더 영역</div>
            </div>
          </div>

          <!-- 우측: 메타 정보 선택 영역 -->
          <div class="form-side">
            <div class="form-section">
              <label>{{ t.col_status }}</label>
              <div class="custom-status-dropdown" v-click-outside="() => isStatusOpen = false">
                <div 
                  class="status-trigger" 
                  :class="form.status?.toLowerCase().replace(' ', '-')"
                  @click="isStatusOpen = !isStatusOpen"
                >
                  <span class="status-dot"></span>
                  <span class="status-label">{{ getStatusLabel(form.status) }}</span>
                  <span class="arrow-down">▼</span>
                </div>
                <div class="status-options" v-if="isStatusOpen">
                  <div 
                    v-for="opt in ['To Do', 'In Progress', 'Done']" 
                    :key="opt"
                    class="status-option"
                    :class="opt.toLowerCase().replace(' ', '-')"
                    @click="onStatusSelect(opt)"
                  >
                    <span class="status-dot"></span>
                    {{ getStatusLabel(opt) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <label>{{ t.label_importance }}</label>
              <select v-model="form.importance" class="full-select">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            <div class="form-section">
              <label>{{ t.label_frequency }}</label>
              <select v-model="form.frequency" class="full-select">
                <option value="One">One</option>
                <option value="Sometime">Sometime</option>
                <option value="Always">Always</option>
              </select>
            </div>

            <div class="form-section"><label>{{ t.label_phase }}</label><input v-model="form.phase" class="full-input" /></div>
            <div class="form-section"><label>{{ t.label_block }}</label><input v-model="form.block" class="full-input" /></div>
            <div class="form-section"><label>{{ t.label_feature }}</label><input v-model="form.feature" class="full-input" /></div>
            <div class="form-section"><label>{{ t.label_tc_no }}</label><input v-model="form.tcNo" class="full-input" /></div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn secondary">{{ t.label_cancel }}</button>
        <button @click="handleSave" class="btn primary" :disabled="loading">
          {{ loading ? t.label_saving : (mode === 'create' ? t.label_create : t.label_edit) }}
        </button>
      </div>
    </div>

    <!-- 사용자 검색 팝업 -->
    <UserSearchModal 
      :isOpen="isUserModalOpen" 
      @close="isUserModalOpen = false" 
      @select="onAddAssignee" 
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import UserSearchModal from './UserSearchModal.vue';
import { t } from '../../api/i18n';

/**
 * Props & Emits
 */
const props = defineProps({
  isOpen: Boolean,
  mode: String,
  initialData: Object,
  loading: Boolean,
  models: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'save']);

/**
 * 상태 변수
 */
const form = ref({});
const problemType = ref('S/W');
const isUserModalOpen = ref(false);
const selectedAssigneeIds = ref([]);
const isStatusOpen = ref(false);

const getStatusLabel = (status) => {
  if (status === 'To Do') return t.value.status_todo;
  if (status === 'In Progress') return t.value.status_inprogress;
  if (status === 'Done') return t.value.status_done;
  return status;
};

/**
 * 모달이 열릴 때 초기 데이터 셋팅
 */
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(props.initialData));
    selectedAssigneeIds.value = [];
  }
}, { immediate: true });

/**
 * Click Outside Directive
 */
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) binding.value(event);
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

/**
 * 핸들러 함수들
 */
const onStatusSelect = (newStatus) => {
  form.value.status = newStatus;
  isStatusOpen.value = false;
};

const onAddAssignee = (user) => {
  if (!form.value.assignees) form.value.assignees = [];
  if (!form.value.assignees.some(u => u.id === user.id)) {
    form.value.assignees.push(user);
  }
};

const removeSelectedAssignees = () => {
  form.value.assignees = form.value.assignees.filter(u => !selectedAssigneeIds.value.includes(u.id));
  selectedAssigneeIds.value = [];
};

const toggleAllAssignees = (e) => {
  selectedAssigneeIds.value = e.target.checked ? form.value.assignees.map(u => u.id) : [];
};

const handleSave = () => {
  emit('save', form.value);
};
</script>

<style scoped>
/* (Existing styles remain unchanged) */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(9, 30, 66, 0.54); display: flex; align-items: center; justify-content: center; z-index: 1100; }
.modal-content { background: white; width: 95%; max-width: 1100px; max-height: 90vh; border-radius: 6px; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0, 82, 204, 0.2); border: 1px solid var(--border-blue); }
.modal-header { padding: 18px 24px; border-bottom: 2px solid var(--border-blue); display: flex; justify-content: space-between; align-items: center; background-color: var(--pale-blue); }
.modal-header h3 { margin: 0; font-size: 20px; color: var(--dark-blue); font-weight: 700; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; background-color: #ffffff; }
.info-banner { display: flex; gap: 24px; padding: 14px 20px; background: var(--soft-blue); border: 1px solid var(--border-blue); border-radius: 4px; margin-bottom: 24px; font-size: 13px; }
.info-item label { font-weight: 700; color: var(--dark-blue); margin-right: 10px; }
.type-select { border: 1px solid var(--border-blue); border-radius: 4px; padding: 4px 8px; font-weight: 600; color: var(--primary-blue); }
.form-layout { display: flex; gap: 32px; }
.form-main { flex: 1; min-width: 0; }
.form-side { width: 280px; padding-left: 32px; border-left: 1px solid var(--border-blue); }
.form-section { margin-bottom: 24px; }
.section-label { display: block; font-size: 14px; font-weight: 700; color: var(--dark-blue); margin-bottom: 8px; text-transform: uppercase; }
.assignee-controls { display: flex; justify-content: space-between; margin-bottom: 8px; }
.type-dropdown { padding: 6px; border: 1px solid var(--border-blue); border-radius: 4px; font-weight: 600; color: var(--primary-blue); }
.assignee-grid table { width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid var(--border-blue); }
.assignee-grid th, .assignee-grid td { padding: 10px; border: 1px solid var(--border-blue); text-align: left; }
.assignee-grid th { background: var(--soft-blue); color: var(--dark-blue); font-weight: 700; }
.title-input { width: 100%; padding: 12px; font-size: 18px; border: 2px solid var(--border-blue); border-radius: 4px; font-weight: 600; color: var(--text-dark); background-color: var(--pale-blue); transition: all 0.2s; }
.title-input:focus { border-color: var(--primary-blue); background-color: #ffffff; outline: none; box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1); }
.quill-wrapper { background: white; border: 2px solid var(--border-blue); border-radius: 4px; overflow: hidden; }
.quill-wrapper:focus-within { border-color: var(--primary-blue); }
.quill-wrapper :deep(.ql-toolbar) { border: none; border-bottom: 1px solid var(--border-blue); background-color: var(--pale-blue); }
.quill-wrapper :deep(.ql-container) { border: none; min-height: 150px; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.full-input, .full-select { width: 100%; padding: 10px; border: 1px solid var(--border-blue); border-radius: 4px; margin-top: 4px; background: white; font-size: 14px; color: var(--text-dark); }
.full-input:focus, .full-select:focus { border-color: var(--primary-blue); outline: none; box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1); }
.innorix-box { height: 100px; border: 2px dashed var(--border-blue); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); background: var(--pale-blue); font-weight: 600; }
.modal-footer { padding: 18px 24px; border-top: 2px solid var(--border-blue); display: flex; justify-content: flex-end; gap: 12px; background-color: var(--pale-blue); }
.close-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: #5e6c84; }
.custom-status-dropdown { position: relative; width: 100%; margin-top: 4px; }
.status-trigger { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 3px; font-weight: 700; font-size: 11px; text-transform: uppercase; cursor: pointer; }
.status-dot { width: 8px; height: 8px; border-radius: 2px; }
.arrow-down { font-size: 8px; margin-left: auto; opacity: 0.6; }
.status-trigger.to-do, .status-option.to-do { background: #dfe1e6; color: #42526e; }
.status-trigger.in-progress, .status-option.in-progress { background: #deebff; color: #0052cc; }
.status-trigger.done, .status-option.done { background: #e3fcef; color: #006644; }
.status-options { position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: white; border-radius: 4px; box-shadow: 0 4px 12px rgba(9,30,66,0.15); z-index: 1200; overflow: hidden; border: 1px solid #dfe1e6; }
.status-option { padding: 10px 12px; display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; cursor: pointer; }
.status-option:hover { filter: brightness(0.95); }
.btn { padding: 8px 16px; border-radius: 3px; border: none; cursor: pointer; font-weight: 600; font-size: 14px; }
.btn.primary { background: #0052cc; color: white; }
.btn.secondary { background: #f4f5f7; color: #42526e; }
.btn.danger { background: #ffebe6; color: #bf2600; }
.btn.small { padding: 4px 8px; font-size: 12px; }
</style>
