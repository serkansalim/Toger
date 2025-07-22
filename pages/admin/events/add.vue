<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEventRepository } from '~/repositories/EventRepository'
import type { CreateEventDto } from '~/types/event/CreateEventDto'

const router = useRouter()
const { create } = useEventRepository()
const { showToast } = useToast()
const { eventOptions } = useEventTypes()

const loading = ref(false)
const form = ref<CreateEventDto>({
	football_club_id: 1,
	title: '',
	description: '',
	startDate: '',
	endDate: '',
	location: '',
	type: 'meeting'
})

const handleSubmit = async () => {
	loading.value = true
	try {
		form.value.startDate = new Date(form.value.startDate).toISOString()
		form.value.endDate = new Date(form.value.endDate).toISOString()

		const result = await create(form.value)

		if (result.success) {
			showToast('✅ Etkinlik başarıyla oluşturuldu!', 'success')
			router.push('/admin/events')
		} else {
			showToast(result.message || 'Hata oluştu', 'danger')
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
		<h2>Yeni Etkinlik Ekle</h2>

		<form @submit.prevent="handleSubmit" class="row g-3">
			<div class="col-md-6">
				<label class="form-label">Başlık</label>
				<input v-model="form.title" type="text" class="form-control" required />
			</div>

			<div class="col-md-6">
				<label class="form-label">Tür</label>
				<select v-model="form.type" class="form-select" required>
					<option v-for="option in eventOptions" :key="option.value" :value="option.value">
						{{ option.label }}
					</option>
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
				<button type="submit" :disabled="loading" class="btn btn-success">
					<span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
					Kaydet
				</button>
			</div>
		</form>
	</div>
</template>
