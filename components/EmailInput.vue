<template>
  <div class="email-input mb-3">
    <input
      id="email"
      type="email"
      v-model="email"
      @input="onInput"
      placeholder="örnek@gmail.com"
      :class="['form-control', { 'is-invalid': error }]"
    />
    <div v-if="error" class="invalid-feedback">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const email = ref(props.modelValue)
const error = ref('')

const onInput = () => {
  emit('update:modelValue', email.value)
}

// Basit e-posta regex kontrolü
watch(email, (newVal) => {
  if (newVal === '') {
    error.value = ''
    emit('update:isValid', true)
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newVal)
  ) {
    error.value = 'Geçerli bir e-posta adresi giriniz.'
    emit('update:isValid', false)
  } else {
    error.value = ''
    emit('update:isValid', true)
  }
})
</script>

<style scoped>
.email-input {
  max-width: 300px;
}
</style>
