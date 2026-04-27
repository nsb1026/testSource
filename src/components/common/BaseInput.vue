<template>
  <div class="input-group" :class="{ 'has-error': error }">
    <label v-if="label" class="input-label">
      <span v-if="required" class="required-mark">*</span>
      {{ label }}
    </label>
    <slot>
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="base-input"
        :class="inputClass"
        :placeholder="placeholder"
        v-bind="$attrs"
      />
    </slot>
    <span v-if="error" class="input-error-msg">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  required: Boolean,
  error: String,
  inputClass: [String, Object, Array]
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.base-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-blue);
  border-radius: 4px;
  background: white;
  font-size: 14px;
  color: var(--text-dark);
  transition: border-color 0.2s;
}

.base-input:focus {
  border-color: var(--primary-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
}

.has-error .base-input {
  border-color: var(--error-red);
  border-bottom-width: 2px;
}
</style>
