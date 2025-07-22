<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventRepository } from '~/repositories/EventRepository'
import type { UpdateEventDto } from '~/types/event/UpdateEventDto'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { getById, update } = useEventRepository()
const { showToast } = useToast()

const loading = ref(false)
const form = ref<UpdateEventDto>({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  type: 'meeting'
})

onMounted(async () => {
  const event = await getById(id)
  console.log('Fetched Event:', event)
  form.value = {
    football_club_id: event.football_club_id,
    title: event.title,
    description: event.description,
    startDate: event.startDate.slice(0, 16),
    endDate: event.endDate.slice(0, 16),
    location: event.location,
    type: event.type
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const dto = {
      ...form.value,
      startDate: new Date(form.value.startDate as string).toISOString(),
      endDate: new Date(form.value.endDate as string).toISOString()
    }

    const result = await update(id, dto)
    if (result.success) {
      showToast('✅ Etkinlik başarıyla güncellendi!', 'success')
    } else {
      showToast(result.message || 'Güncellenemedi', 'danger')
    }
  } catch (error: any) {
    showToast(error?.response?.data?.message || 'Sunucu hatası', 'danger')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container py-4">
    <NuxtLink to="/admin/events" class="mb-3 d-block">
      <i class="fas fa-arrow-left me-2"></i> Etkinlikler
    </NuxtLink>
    <h2>Etkinliği Düzenle</h2>

    <form @submit.prevent="handleSubmit" class="row g-3">
      <!-- Aynı form alanları buraya da geliyor -->
      <div class="col-md-6">
        <label class="form-label">Başlık</label>
        <input v-model="form.title" type="text" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Tür</label>
        <select v-model="form.type" class="form-select" required>
          <option value="meeting">Toplantı</option>
          <option value="training">Antrenman</option>
          <option value="other">Diğer</option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Başlangıç</label>
        <input v-model="form.startDate" type="datetime-local" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Bitiş</label>
        <input v-model="form.endDate" type="datetime-local" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Yer</label>
        <input v-model="form.location" type="text" class="form-control" required />
      </div>

      <div class="col-md-12">
        <label class="form-label">Açıklama</label>
        <textarea v-model="form.description" class="form-control" rows="3"></textarea>
      </div>

      <div class="col-md-12">
        <button type="submit" :disabled="loading" class="btn btn-primary">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Güncelle
        </button>
      </div>
    </form>
  </div>
</template>
