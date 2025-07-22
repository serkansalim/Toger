<template>
	<div class="container py-5">
		<NuxtLink to="/admin/applications" class="mb-3 d-block">
			<i class="fas fa-arrow-left me-2"></i> Başvurular
		</NuxtLink>

		<h2 class="mb-4 fw-bold text-primary">Başvuru Detayı</h2>

		<div v-if="application">
			<div class="card shadow p-4 mb-5 border-0 position-relative">
				<!-- Durum Etiketi -->
				<span class="badge position-absolute top-0 end-0 m-3 px-3 py-2 fs-6" :class="{
					'bg-success': application.status === 'accepted',
					'bg-danger': application.status === 'rejected',
					'bg-secondary': !application.status || application.status === 'pending'
				}">
					{{
						application.status === 'accepted'
							? 'Onaylandı'
							: application.status === 'rejected'
								? 'Reddedildi'
								: 'Beklemede'
					}}
				</span>

				<div class="text-center mb-4">
					<img :src="application.photo || '/Data/default-player.png'"
						class="rounded-circle shadow-sm border border-3"
						style="width: 140px; height: 140px; object-fit: cover;" alt="Oyuncu Fotoğrafı" />
				</div>

				<div class="row g-4">
					<!-- Veli Bilgileri -->
					<div class="col-md-6">
						<h5 class="text-primary fw-bold border-bottom pb-2 mb-3">👨‍👩‍👧 Veli Bilgileri</h5>
						<div class="mb-2"><strong>Ad:</strong> {{ application.parentName }}</div>
						<div class="mb-2"><strong>Soyad:</strong> {{ application.parentSurname }}</div>
						<div class="mb-2"><strong>T.C. Kimlik:</strong> {{ application.parentUniqueId }}</div>
						<div class="mb-2"><strong>Telefon:</strong> {{ application.phone }}</div>
						<div class="mb-2"><strong>E-posta:</strong> {{ application.email }}</div>
						<div v-if="application.notes" class="mb-2"><strong>Not:</strong> {{ application.notes }}</div>
					</div>

					<!-- Oyuncu Bilgileri -->
					<div class="col-md-6">
						<h5 class="text-primary fw-bold border-bottom pb-2 mb-3">⚽ Oyuncu Bilgileri</h5>
						<div class="mb-2"><strong>Ad:</strong> {{ application.playerName }}</div>
						<div class="mb-2"><strong>Soyad:</strong> {{ application.playerSurname }}</div>
						<div class="mb-2"><strong>T.C. Kimlik:</strong> {{ application.playerUniqueId }}</div>
						<div class="mb-2"><strong>Doğum Tarihi:</strong> {{ application.birthDate }}</div>
						<div class="mb-2"><strong>Doğum Yeri:</strong> {{ application.birthPlace || '-' }}</div>
						<div class="mb-2"><strong>Oyuncu Telefon:</strong> {{ application.playerPhone || '-' }}</div>
						<div class="mb-2"><strong>Uyruğu:</strong> {{ application.nation || '-' }}</div>
						<div class="mb-2"><strong>Ayak Tercihi:</strong>
							{{ application.foot === 'Right' ? 'Sağ Ayak' : application.foot === 'Left' ? 'Sol Ayak' :
								application.foot === 'Both' ? 'İki Ayak' : '-' }}
						</div>
						<div class="mb-2"><strong>Mevki:</strong> {{ getPositionLabel(application.position) }}</div>
						<div class="mb-2"><strong>Boy:</strong> {{ application.height || '-' }} cm</div>
						<div class="mb-2"><strong>Kilo:</strong> {{ application.weight || '-' }} kg</div>
					</div>
				</div>
			</div>

			<!-- Butonlar -->
			<div class="text-end mt-4" v-if="application?.status === 'rejected'">
				<button @click="acceptApplication" class="btn btn-success btn-lg">Onayla</button>
			</div>
			<div class="text-end mt-4 d-flex gap-3 justify-content-end" v-else-if="application?.status !== 'accepted'">
				<button @click="openRejectModal" class="btn btn-outline-danger btn-lg">Reddet</button>
				<button @click="acceptApplication" class="btn btn-success btn-lg">Onayla</button>
			</div>
		</div>

		<!-- Skeleton Yükleniyor Ekranı -->
		<div v-else>
			<div class="card p-4 mb-4">
				<div class="text-center mb-4">
					<div class="placeholder rounded-circle bg-secondary-subtle" style="width: 140px; height: 140px;">
					</div>
				</div>

				<div class="row g-4">
					<div class="col-md-6">
						<div class="placeholder-glow mb-2">
							<span class="placeholder col-6 rounded"></span>
						</div>
						<div class="placeholder-glow mb-2">
							<span class="placeholder col-8 rounded"></span>
						</div>
						<div class="placeholder-glow mb-2">
							<span class="placeholder col-7 rounded"></span>
						</div>
						<div class="placeholder-glow mb-2">
							<span class="placeholder col-5 rounded"></span>
						</div>
					</div>
					<div class="col-md-6">
						<div class="placeholder-glow mb-2">
							<span class="placeholder col-6 rounded"></span>
						</div>
						<div class="placeholder-glow mb-2">
							<span class="placeholder col-8 rounded"></span>
						</div>
						<div class="placeholder-glow mb-2">
							<span class="placeholder col-5 rounded"></span>
						</div>
						<div class="placeholder-glow mb-2">
							<span class="placeholder col-6 rounded"></span>
						</div>
					</div>
				</div>
			</div>
		</div>


		<!-- REDDETME MODALI -->
		<div class="modal fade show d-block" tabindex="-1" v-if="showRejectModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content shadow">
					<div class="modal-header">
						<h5 class="modal-title">Başvuruyu Reddet</h5>
						<button type="button" class="btn-close" @click="closeRejectModal"></button>
					</div>
					<div class="modal-body">
						<label class="form-label">Reddetme Sebebi</label>
						<textarea v-model="rejectionReason" class="form-control" rows="4"
							placeholder="Sebebinizi yazınız..."></textarea>
					</div>
					<div class="modal-footer">
						<button class="btn btn-secondary" @click="closeRejectModal">İptal</button>
						<button class="btn btn-danger" @click="confirmReject">Reddet</button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal-backdrop fade show" v-if="showRejectModal"></div>

	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useApplicationRepository } from '~/repositories/ApplicationsRepository'
import { useToast } from '~/composables/useToast'
import type { Application } from '~/types/application/Application'
import { POSITIONS } from '~/utils/position'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const { getById, accept, reject } = useApplicationRepository()

const application = ref<Application>()
const showRejectModal = ref(false)
const rejectionReason = ref('')

const getPositionLabel = (value: string | null) => {
	return POSITIONS.find(p => p.value === value)?.label || 'Bilinmiyor'
}

// Başvuru detayını getir
onMounted(async () => {
	try {
		const id = Number(route.params.id)
		const result = await getById(id)
		application.value = result.data
	} catch (error) {
		console.error('Detay alınamadı ❌', error)
	}
})

// Başvuruyu onayla
const acceptApplication = async () => {
	if (!application.value) {
		showToast('Başvuru verisi bulunamadı ❌')
		return
	}

	try {
		await accept(application.value.id)

		showToast('Başvuru başarıyla onaylandı ✅', 'success')
		router.push('/admin/applications')
	} catch (error: any) {
		console.error('Onaylama hatası ❌', error)
		const message =
			error?.response?.data?.message ||
			error?.message ||
			'Onaylama sırasında bilinmeyen bir hata oluştu ❌'
		showToast(message, 'danger')
	}
}

// Modalı aç/kapat
const openRejectModal = () => {
	showRejectModal.value = true
}
const closeRejectModal = () => {
	showRejectModal.value = false
	rejectionReason.value = ''
}

// Başvuruyu reddet
const confirmReject = async () => {
	if (!rejectionReason.value.trim()) {
		showToast('Reddetme sebebi gerekli ❌')
		return
	}

	try {
		await reject(application.value!.id, {
			rejectionReason: rejectionReason.value.trim(),
		})
		showToast('Başvuru reddedildi 🗑️', 'success')
		router.push('/admin/applications')
	} catch (error: any) {
		console.error('Reddetme hatası:', error)
		const message =
			error?.response?.data?.message ||
			error?.message ||
			'Reddetme sırasında bilinmeyen bir hata oluştu ❌'
		showToast(message, 'danger')
	} finally {
		closeRejectModal()
	}
}
</script>

<style scoped>
.modal {
	display: block;
	background: rgba(0, 0, 0, 0.4);
}

.modal .modal-dialog {
	margin-top: 0;
}
</style>