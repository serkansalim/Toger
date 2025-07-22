<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useTrainingRepository } from '~/repositories/TrainingRepository'
import { useTeamRepository } from '~/repositories/TeamRepository'
import type { CreateTrainingDto } from '~/types/training/CreateTrainingDto'

const router = useRouter()
const { showToast } = useToast()
const { create } = useTrainingRepository()
const { getAll } = useTeamRepository()

const teams = ref([])
const loading = ref(false)

const form = ref({
  title: '',
  description: '',
  date: '',
  teamId: null
})

onMounted(async () => {
  const res = await getAll({ page: 1, limit: 1000 })
  teams.value = res.data
})

const handleSubmit = async () => {
  loading.value = true

  try {
    form.value.date = new Date(form.value.date).toISOString()
    const result = await create(form.value)

    if (result.success === true) {
      showToast('✅ Antreman başarıyla oluşturuldu!', 'success')
      router.push('/admin/trainings')
      loading.value = false
      return
    }

    showToast(result?.message || 'Bir hata oluştu', 'error')
    loading.value = false

  } catch (error: any) {
    console.error('Create Training Error:', error)

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Bilinmeyen bir hata oluştu'

    showToast(`❌ ${message}`, 'danger')
  } finally {
    loading.value = false
  }
}
</script>


<template>
	<div class="container py-4">
	  <NuxtLink to="/admin/trainings">
		<i class="fas fa-arrow-left me-2"></i> antremanlar
	  </NuxtLink>
  
	  <h2 class="mb-4">Yeni Antreman Ekle</h2>
  
	  <form @submit.prevent="handleSubmit" class="row g-3">
		<div class="col-md-6">
		  <label>Başlık</label>
		  <input v-model="form.title" type="text" class="form-control" required />
		</div>
		<div class="col-md-6">
		  <label>Tarih</label>
		  <input v-model="form.date" type="date" class="form-control" required />
		</div>
		<div class="col-md-12">
		  <label>Açıklama</label>
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
		  <button class="btn btn-success" type="submit" :disabled="loading">Kaydet</button>
		</div>
	  </form>
	</div>
  </template>
  
