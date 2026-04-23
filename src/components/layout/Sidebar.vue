<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <!-- 메뉴 클릭 시 부모(App.vue)로 해당 메뉴 ID를 전달합니다 -->
        <li 
          v-for="item in menuItems" 
          :key="item.id" 
          class="menu-item" 
          :class="{ active: currentMenu === item.name }"
          @click="$emit('change-menu', item.name)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { t } from '../../api/i18n';

defineProps({ currentMenu: String });
defineEmits(['change-menu']);

const menuItems = computed(() => [
  { id: 1, name: 'Issue', label: t.value.menu_issue, icon: '🎫' },
  { id: 2, name: 'Models', label: t.value.menu_models, icon: '📱' },
  { id: 3, name: 'WorkspaceInfo', label: t.value.menu_workspace, icon: 'ℹ️' },
]);
</script>

<style scoped>
.sidebar { 
  width: 240px; 
  background-color: var(--sidebar-bg); 
  border-right: 1px solid var(--border-blue); 
  padding: 24px 0; 
}

ul { list-style: none; padding: 0; margin: 0; }

.menu-item { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  padding: 12px 24px; 
  cursor: pointer; 
  color: #42526e; 
  transition: all 0.2s; 
  border-left: 4px solid transparent;
}

.menu-item:hover { 
  background-color: var(--soft-blue); 
  color: var(--primary-blue);
}

.menu-item.active { 
  background-color: var(--light-blue); 
  color: var(--primary-blue); 
  font-weight: 600; 
  border-left-color: var(--primary-blue); 
}

.menu-icon { font-size: 18px; }
.menu-label { font-size: 14px; }
</style>
