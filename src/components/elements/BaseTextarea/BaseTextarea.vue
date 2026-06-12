<template>
  <div class="textarea">
    <div :class="['textarea__wrapper', { 'textarea__wrapper--error': error, 'textarea__wrapper--focused': isFocused }]">
      <label :for="fieldId" :class="['textarea__label', { 'textarea__label--raised': isRaised }]">
        {{ label }}<span v-if="required" class="textarea__required" aria-hidden="true"> *</span>
      </label>
      <textarea
        :id="fieldId"
        v-bind="$attrs"
        :value="modelValue"
        :required="required"
        :rows="rows"
        class="textarea__field"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <p v-if="error" class="textarea__error" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label:      { type: String, required: true },
  rows:       { type: Number, default: 4 },
  error:      { type: String, default: '' },
  required:   { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
defineOptions({ inheritAttrs: false })

const fieldId = `textarea-${Math.random().toString(36).slice(2)}`
const isFocused = ref(false)
const isRaised = computed(() => isFocused.value || !!props.modelValue)
</script>

<style lang="scss" scoped>
@import './BaseTextarea.scss';
</style>
