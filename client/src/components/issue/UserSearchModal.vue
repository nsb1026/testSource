<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>사용자 검색</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <input 
          v-model="searchQuery" 
          @input="onSearch" 
          placeholder="이름으로 검색..." 
          class="search-input"
          ref="inputField"
        />
        <ul class="user-list">
          <li v-for="user in results" :key="user.id" @click="selectUser(user)">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-dept">{{ user.department }}</span>
          </li>
          <li v-if="results.length === 0 && searchQuery" class="no-results">
            검색 결과가 없습니다.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { issueService } from '../../api/issueService';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'select']);

const searchQuery = ref('');
const results = ref([]);
const inputField = ref(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    searchQuery.value = '';
    results.value = [];
    nextTick(() => inputField.value?.focus());
  }
});

const onSearch = async () => {
  if (searchQuery.value.length < 1) {
    results.value = [];
    return;
  }
  results.value = await issueService.searchUsers(searchQuery.value);
};

const selectUser = (user) => {
  emit('select', user);
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 400px;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 82, 204, 0.2);
  border: 1px solid var(--border-blue);
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 2px solid var(--border-blue);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--soft-blue);
}

.modal-header h3 { margin: 0; font-size: 18px; color: var(--dark-blue); font-weight: 700; }

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--primary-blue);
}

.modal-body {
  padding: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 2px solid var(--border-blue);
  border-radius: 4px;
  margin-bottom: 16px;
  background-color: var(--pale-blue);
  transition: all 0.2s;
}

.search-input:focus {
  border-color: var(--primary-blue);
  background-color: white;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid var(--soft-blue);
  border-radius: 4px;
}

.user-list li {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--soft-blue);
  transition: background-color 0.1s;
}

.user-list li:last-child { border-bottom: none; }

.user-list li:hover {
  background-color: var(--light-blue);
}

.user-name { font-weight: 700; color: var(--text-dark); }
.user-dept { font-size: 11px; font-weight: 700; color: var(--primary-blue); background: var(--soft-blue); padding: 2px 6px; border-radius: 3px; }
.no-results { color: #5e6c84; font-size: 14px; text-align: center; padding: 20px; }
</style>
