<template>
  <div class="model-list-container">
    <div class="list-header">
      <h2>Registered Models</h2>
    </div>
    <div class="list-content">
      <div 
        v-for="model in models" 
        :key="model.id" 
        class="model-card"
        :class="{ selected: selectedModelId === model.id }"
        @click="$emit('select-model', model)"
      >
        <div class="model-name">{{ model.name }}</div>
        <div class="model-meta">
          <span class="category-tag">{{ model.category }}</span>
          <span class="owner">{{ model.owner }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ 
  models: Array,
  selectedModelId: Number
});
defineEmits(['select-model']);
</script>

<style scoped>
.model-list-container { 
  width: 320px; 
  border-right: 1px solid var(--border-blue); 
  display: flex; 
  flex-direction: column; 
  background: white; 
}

.list-header { 
  padding: 16px 24px; 
  border-bottom: 1px solid var(--border-blue); 
}

.list-header h2 { margin: 0; font-size: 16px; color: var(--dark-blue); }

.list-content { flex: 1; overflow-y: auto; }

.model-card { 
  padding: 12px 24px; 
  border-bottom: 1px solid var(--soft-blue); 
  cursor: pointer; 
  transition: all 0.2s; 
  border-left: 4px solid transparent;
}

.model-card:hover { background-color: var(--soft-blue); }
.model-card.selected { 
  background-color: var(--light-blue); 
  border-left-color: var(--primary-blue);
}

.model-name { font-weight: 600; color: var(--text-dark); margin-bottom: 4px; }
.model-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }

.category-tag { 
  background: var(--border-blue); 
  padding: 2px 6px; 
  border-radius: 3px; 
  color: var(--dark-blue); 
  font-weight: 500;
}

.owner { color: #5e6c84; }
</style>
