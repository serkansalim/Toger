<template>
    <div v-if="visible" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      <div :class="`toast show text-white bg-${type} border-0`" role="alert">
        <div class="d-flex">
          <div class="toast-body">
            {{ message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="visible = false"></button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const message = ref('')
  const visible = ref(false)
  const type = ref<'success' | 'error'>('success')
  
  const show = (msg: string, toastType: 'success' | 'error', duration: number) => {
    message.value = msg
    type.value = toastType
    visible.value = true
    setTimeout(() => visible.value = false, duration)
  }
  
  const handler = (event: Event) => {
    const { message, type, duration } = (event as CustomEvent).detail
    show(message, type, duration)
  }
  
  onMounted(() => {
    window.addEventListener('toast:show', handler)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('toast:show', handler)
  })
  </script>
  