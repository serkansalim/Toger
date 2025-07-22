<template>
    <div class="phone-input mb-3">
        <input
            id="phone"
            type="tel"
            v-model="phone"
            @input="onInput"
            placeholder="05XXXXXXXXX"
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

const phone = ref(props.modelValue)
const error = ref('')

const onInput = () => {
  phone.value = phone.value.replace(/\D/g, '').slice(0, 11)
  emit('update:modelValue', phone.value)
}

watch(phone, (newVal) => {
  if (newVal === '') {
    error.value = ''
    emit('update:isValid', true)
  } else if (!/^05\d{9}$/.test(newVal)) {
    error.value = 'Geçerli bir Türkçe telefon numarası giriniz (05XXXXXXXXX).'
    emit('update:isValid', false)
  } else {
    error.value = ''
    emit('update:isValid', true)
  }
})
</script>


<style scoped>
.phone-input {
    max-width: 300px;
}
</style>
