<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSponsorRepository } from '~/repositories/SponsorRepository'
import type { CreateSponsorDto } from '~/types/sponsor/CreateSponsorDto'
import { useToast } from '~/composables/useToast'

const router = useRouter()
const { create } = useSponsorRepository()
const { showToast } = useToast()

const loading = ref(false)
const form = ref<CreateSponsorDto>({
	name: '',
	logoUrl: '',
	websiteUrl: '',
	isActive: true
})

const handleSubmit = async () => {
	loading.value = true
	try {
		const result = await create(form.value)
		if (result.success) {
			showToast('✅ Sponsor başarıyla eklendi!', 'success')
			router.push('/admin/sponsors')
		} else {
			showToast(result.message || 'Ekleme başarısız', 'danger')
		}
	} catch (e: any) {
		showToast(e?.response?.data?.message || 'Sunucu hatası', 'danger')
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
		<h2>Yeni Sponsor Ekle</h2>

		<form @submit.prevent="handleSubmit" class="row g-3">
			<div class="col-md-6">
				<label class="form-label">Ad</label>
				<input v-model="form.name" type="text" class="form-control" required />
			</div>

			<div class="col-md-6">
				<label class="form-label">Logo URL</label>
				<input v-model="form.logoUrl" type="url" class="form-control" />
			</div>

			<div class="col-md-6">
				<label class="form-label">Web Sitesi</label>
				<input v-model="form.websiteUrl" type="url" class="form-control" />
			</div>

			<div class="col-md-6">
				<label class="form-label">Aktif mi?</label>
				<select v-model="form.isActive" class="form-select">
					<option :value="true">Evet</option>
					<option :value="false">Hayır</option>
				</select>
			</div>

			<div class="col-12">
				<button type="submit" :disabled="loading" class="btn btn-success">
					<span v-if="loading" class="spinner-border spinner-border-sm me-2" />
					Kaydet
				</button>
			</div>
		</form>
	</div>
</template>
