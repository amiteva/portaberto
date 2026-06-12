<template>
  <div class="input">
    <div :class="['input__wrapper', { 'input__wrapper--error': error, 'input__wrapper--focused': isFocused }]">
      <label :for="inputId" :class="['input__label', { 'input__label--raised': isRaised }]">
        {{ label }}<span v-if="required" class="input__required" aria-hidden="true"> *</span>
      </label>
      <input
        :id="inputId"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :required="required"
        :placeholder="isFocused ? '' : ''"
        class="input__field"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <p v-if="error" class="input__error" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label:      { type: String, required: true },
  type:       { type: String, default: 'text' },
  error:      { type: String, default: '' },
  required:   { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
defineOptions({ inheritAttrs: false })

const inputId = `input-${Math.random().toString(36).slice(2)}`
const isFocused = ref(false)
const hasValue = computed(() => props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined)
const isTemporalType = computed(() => ['date', 'time', 'datetime-local', 'month', 'week'].includes(props.type))
const isRaised = computed(() => isFocused.value || hasValue.value || isTemporalType.value)
</script>

<style lang="scss" scoped>
@import './BaseInput.scss';
</style>
