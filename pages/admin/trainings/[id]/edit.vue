<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useTrainingRepository } from '~/repositories/TrainingRepository'
import { useTeamRepository } from '~/repositories/TeamRepository'
import type { Team } from '~/types/team/Team'
import type { CreateTrainingDto } from '~/types/training/CreateTrainingDto'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const { getById, update } = useTrainingRepository()
const { getAll } = useTeamRepository()

const id = Number(route.params.id)
const form = ref<CreateTrainingDto>({
  title: '',
  description: '',
  date: '',
  teamId: null,
})

const teams = ref<Team[]>([])
const loading = ref(false)

onMounted(async () => {
  const training = await getById(id)

  form.value = {
    title: training.title,
    description: training.description,
    date: training.date.slice(0, 10), // yyyy-MM-dd
    teamId: training.team?.id ?? null,
  }

  const teamRes = await getAll({ page: 1, limit: 1000 })
  teams.value = teamRes.data
})

const handleSubmit = async () => {
  loading.value = true

  try {
    const updatedTraining = {
      ...form.value,
      date: new Date(form.value.date).toISOString(),
    }

    // Validate the teamId if needed (just for safety)
    if (updatedTraining.teamId === null) {
      showToast('❌ Takım seçilmelidir!', 'danger')
      return
    }

    const result = await update(id, updatedTraining)

    if (result.success) {
      showToast('✅ Antreman başarıyla güncellendi!', 'success')
      router.push('/admin/trainings')
    } else {
      showToast(result.message || 'Bir hata oluştu', 'error')
    }
  } catch (err: any) {
    console.error('Update error:', err)
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Bilinmeyen bir hata oluştu'
    showToast(`❌ ${msg}`, 'danger')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container py-4">
    <NuxtLink to="/admin/trainings">
      <i class="fas fa-arrow-left me-2"></i> Antremanlar
    </NuxtLink>

    <h2 class="mb-4">Antreman Düzenle</h2>

    <form @submit.prevent="handleSubmit" class="row g-3">
      <div class="col-md-6">
        <label>Lokasyon</label>
        <input v-model="form.title" type="text" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label>Tarih</label>
        <input v-model="form.date" type="date" class="form-control" required />
      </div>

      <div class="col-md-12">
        <label>Not</label>
        <textarea v-model="form.description" class="form-control"></textarea>
      </div>

      <div class="col-md-6">
        <label>Takım</label>
        <select v-model.number="form.teamId" class="form-select" required>
          <option value="">Takım seçin</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">
            {{ team.name }} ({{ team.ageGroup }})
          </option>
        </select>
      </div>

      <div class="col-md-12">
        <button class="btn btn-primary" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Güncelle
        </button>
      </div>
    </form>
  </div>
</template>
