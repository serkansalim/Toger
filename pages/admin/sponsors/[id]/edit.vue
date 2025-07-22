<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSponsorRepository } from '~/repositories/SponsorRepository'
import type { UpdateSponsorDto } from '~/types/sponsor/UpdateSponsorDto'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { getById, update } = useSponsorRepository()
const { showToast } = useToast()

const loading = ref(false)
const form = ref<UpdateSponsorDto>({
	name: '',
	logoUrl: '',
	websiteUrl: '',
	isActive: true
})

onMounted(async () => {
	try {
		const sponsor = await getById(id)
		form.value = {
			name: sponsor.name,
			logoUrl: sponsor.logoUrl,
			websiteUrl: sponsor.websiteUrl,
			isActive: sponsor.isActive ?? true 

		}
	} catch (error: any) {
		showToast(error?.response?.data?.message || 'Sponsor verisi alınamadı', 'danger')
	}
})

const handleSubmit = async () => {
	loading.value = true
	try {
		const result = await update(id, form.value)
		if (result.success) {
			showToast('✅ Sponsor başarıyla güncellendi!', 'success')
			router.push('/admin/sponsors')
		} else {
			showToast(result.message || 'Güncelleme başarısız', 'danger')
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
		<NuxtLink to="/admin/sponsors" class="mb-3 d-block">
			<i class="fas fa-arrow-left me-2"></i> Sponsorlar
		</NuxtLink>
		<h2>Sponsor Düzenle</h2>

		<form @submit.prevent="handleSubmit" class="row g-3">
			<div class="col-md-6">
				<label class="form-label">Sponsor Adı</label>
				<input v-model="form.name" type="text" class="form-control" required />
			</div>

			<div class="col-md-6">
				<label class="form-label">Web Sitesi</label>
				<input v-model="form.websiteUrl" type="url" class="form-control" />
			</div>

			<div class="col-md-6">
				<label class="form-label">Logo URL</label>
				<input v-model="form.logoUrl" type="url" class="form-control" />
			</div>

			<div class="col-md-6">
				<label class="form-label">Aktif mi?</label>
				<select v-model="form.isActive" class="form-select">
					<option :value="true">Evet</option>
					<option :value="false">Hayır</option>
				</select>
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
