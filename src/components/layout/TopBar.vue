<template>
  <header class="top-bar">
    <div class="logo">
      <span class="workspace-icon">🏢</span>
      <span class="workspace-name">Jira Clone Workspace</span>
    </div>
    
    <!-- 사용자 세션 영역 -->
    <div class="user-session-container" v-click-outside="() => isUserMenuOpen = false">
      <div class="user-trigger" @click="isUserMenuOpen = !isUserMenuOpen">
        <span class="user-name-label">{{ currentUser.name }}님</span>
        <div class="avatar">{{ currentUser.name.charAt(0) }}</div>
      </div>

      <!-- 드롭다운 레이아웃 -->
      <div class="user-dropdown" v-if="isUserMenuOpen">
        <div class="dropdown-header">
          <div class="user-info-detail">
            <strong>{{ currentUser.name }}</strong>
            <span>{{ currentUser.email }}</span>
          </div>
        </div>
        <div class="dropdown-body">
          <div class="menu-item lang-toggle">
            <span class="label">언어 (Language)</span>
            <div class="lang-btns">
              <button 
                :class="{ active: currentLang === 'KO' }" 
                @click="changeLang('KO')"
              >KO</button>
              <button 
                :class="{ active: currentLang === 'EN' }" 
                @click="changeLang('EN')"
              >EN</button>
            </div>
          </div>
          <div class="menu-divider"></div>
          <button class="menu-item logout-btn" @click="handleLogout">
            <span class="icon">🚪</span> 로그아웃
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

// 샘플 사용자 정보
const currentUser = ref({
  name: '홍길동',
  email: 'hong@example.com'
});

const isUserMenuOpen = ref(false);
const currentLang = ref('KO');

// 클릭 외부 감지 지시어
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

const changeLang = (lang) => {
  currentLang.value = lang;
  console.log(`언어 변경: ${lang}`);
  // 실제 연동 시 i18n 등을 처리
};

const handleLogout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    console.log('로그아웃 실행');
    // 실제 로그아웃 로직 (세션 제거, 페이지 이동 등)
  }
};
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background-color: #ffffff;
  border-bottom: 2px solid var(--border-blue);
  position: relative;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.workspace-icon { font-size: 24px; }
.workspace-name { font-size: 18px; font-weight: 700; color: var(--dark-blue); }

/* 사용자 세션 영역 */
.user-session-container {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
  border: 1px solid transparent;
}

.user-trigger:hover {
  background-color: var(--soft-blue);
  border-color: var(--border-blue);
}

.user-name-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-blue);
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: var(--primary-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 82, 204, 0.2);
}

/* 드롭다운 레이아웃 */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  margin-top: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 82, 204, 0.15);
  border: 1px solid var(--border-blue);
  overflow: hidden;
  z-index: 1001;
}

.dropdown-header {
  padding: 16px;
  background-color: var(--soft-blue);
  border-bottom: 1px solid var(--border-blue);
}

.user-info-detail {
  display: flex;
  flex-direction: column;
}

.user-info-detail strong { font-size: 14px; color: var(--dark-blue); }
.user-info-detail span { font-size: 12px; color: #5e6c84; }

.dropdown-body {
  padding: 8px 0;
}

.menu-divider {
  height: 1px;
  background-color: var(--border-blue);
  margin: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--text-dark);
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.1s;
}

.menu-item:hover {
  background-color: var(--soft-blue);
  color: var(--primary-blue);
}

.logout-btn { color: #de350b; font-weight: 600; }
.logout-btn .icon { margin-right: 8px; }

.lang-toggle {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  cursor: default;
}
.lang-toggle:hover { background: none; }
.lang-toggle .label { font-size: 11px; font-weight: 700; color: var(--dark-blue); text-transform: uppercase; }

.lang-btns {
  display: flex;
  background-color: var(--pale-blue);
  padding: 3px;
  border-radius: 6px;
  width: 100%;
  border: 1px solid var(--border-blue);
}

.lang-btns button {
  flex: 1;
  padding: 5px;
  border: none;
  background: none;
  font-size: 11px;
  font-weight: 700;
  color: #5e6c84;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.lang-btns button.active {
  background-color: var(--primary-blue);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 82, 204, 0.2);
}
</style>
