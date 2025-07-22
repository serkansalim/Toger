<script setup lang="ts">
definePageMeta({
	layout: 'admin'
})

import { ref, onMounted } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { usePlayerRepository } from '~/repositories/PlayerRepository'
import { useTeamRepository } from '~/repositories/TeamRepository'
import type { Player } from '~/types/player/Player'
import type { Team } from '~/types/team/Team'
import { normalizeFilters } from '~/utils/normalizeFilters'
import { useToast } from '~/composables/useToast'

const players = ref<Player[]>([])
const page = ref(1)
const total = ref(0)
const limit = 10

const filters = ref({
	teamId: null,
	position: null,
	search: null
})

const teams = ref<Team[]>([])

const { getAll: getTeams } = useTeamRepository()
const { getAll, remove } = usePlayerRepository()
const { showToast } = useToast()

// Modal için state
const selectedPlayer = ref<Player | null>(null)
const showDeleteModal = ref(false)

// Oyuncuyu silmeden önce modal açar
const confirmDelete = (player: Player) => {
	selectedPlayer.value = player
	showDeleteModal.value = true
}

// Silme işlemi
const handleDelete = async () => {
	if (!selectedPlayer.value) return
	try {
		await remove(selectedPlayer.value.id)
		showToast('✅ Oyuncu silindi!', 'success')
		showDeleteModal.value = false
		await fetchPlayers() // Listeyi güncelle
	} catch (error: any) {
		console.error('Silme hatası:', error)
		showToast(error?.response?.data?.message || 'Silme sırasında hata oluştu', 'danger')
	}
}

// Oyuncuları çek
const fetchPlayers = async () => {
	const res = await getAll({
		page: page.value,
		limit,
		...normalizeFilters(filters.value)
	})
	players.value = res.data
	total.value = res.total
}

onMounted(async () => {
	const teamRes = await getTeams({ page: 1, limit: 1000 })
	teams.value = teamRes.data
	await fetchPlayers()
})

watch(page, fetchPlayers)

watchDebounced(filters, () => {
	page.value = 1
	fetchPlayers()
}, {
	debounce: 400,
	deep: true
})
</script>

<template>
	<div class="container py-4">
		<h2 class="mb-4">Oyuncular</h2>

		<NuxtLink to="/admin/players/add" class="btn btn-success mb-3">+ Yeni Oyuncu</NuxtLink>

		<div class="row g-2 mb-3">
			<div class="col-md-3">
				<select v-model.number="filters.teamId" class="form-select">
					<option :value="null">Tüm Takımlar</option>
					<option v-for="team in teams" :key="team.id" :value="team.id">
						{{ team.name }} ({{ team.ageGroup }})
					</option>
				</select>
			</div>

			<div class="col-md-3">
				<input v-model="filters.position" type="text" class="form-control" placeholder="Mevki (ör: Kaleci)" />
			</div>

			<div class="col-md-4">
				<input v-model="filters.search" type="text" class="form-control"
					placeholder="Genel arama (Ad / Soyad)" />
			</div>

			<div class="col-md-2 d-flex align-items-start">
				<button @click="filters = { teamId: null, position: null, search: null }"
					class="btn btn-outline-secondary w-100">
					Temizle
				</button>
			</div>
		</div>

		<div class="row">
			<div v-for="player in players" :key="player.id" class="col-12 col-md-6 col-lg-4 shadow-sm py-3 mb-3">
				<div class="rounded d-flex justify-content-between align-items-start bg-primary p-3 h-100">
					<div class="d-flex flex-column flex-md-row align-items-start gap-3">
						<div class="icon bg-white text-primary d-flex align-items-center justify-content-center rounded-circle overflow-hidden"
							style="width: 50px; height: 50px;">
							<img v-if="player.photo" :src="player.photo" class="w-100"/>
                        	<img v-else src="/Data/default-player.png" class="w-100"/>
						</div>
						<div class="info">
							<h5 class="text-white mb-2">{{ player.name }} {{ player.surname }}</h5>
							<small class="text-white">
								<i class="fas fa-id-card me-1"></i>
								{{ player.uniqueId || '-' }}
							</small><br />
							<div class="d-flex align-items-center mt-2">
								<small class="text-white"><i class="fas fa-futbol me-1"></i> {{ player.position
									}}</small>
								<small v-if="player.team" class="text-white ms-2"><i class="fas fa-users me-1"></i> {{ player.team?.name ||
									'-' }}</small>
								<small v-if="player.sportSchool" class="text-white ms-2"><i class="fas fa-users me-1"></i> {{ player.sportSchool?.name ||
									'-' }}</small>
							</div>
							<div class="d-flex align-items-center mt-2">
								<small class="text-white">
									<i class="fas fa-ruler-vertical me-1"></i>
									{{ player.height || '-' }}
								</small>
								<small class="text-white ms-4">
									<i class="fas fa-weight-scale me-1"></i>
									{{ player.weight || '-' }}
								</small>
							</div>

							<div class="d-flex align-items-center mt-2" v-if="player.isFeeRequired">
								<small class="text-white">
									<i class="fas fa-money-bill me-1"></i>
									Aidatlı :
								</small>
								<strong class="text-white ms-2">
									{{ player.feePrice || '-' }} TL
								</strong>
							</div>
						</div>
					</div>
					<div class="text-end d-flex flex-column gap-2">
						<NuxtLink :to="`/admin/players/${player.id}/edit`" class="btn btn-outline-light border-2">
							Düzenle
						</NuxtLink>
						<button @click="confirmDelete(player)" class="btn btn-danger border-2">
							Sil
						</button>
					</div>
				</div>
			</div>
		</div>
		<Pagination v-model="page" :total="total" :limit="limit" />
		<div class="modal fade show" tabindex="-1" style="display: block;" v-if="showDeleteModal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header bg-danger text-white">
						<h5 class="modal-title">Silme Onayı</h5>
						<button type="button" class="btn-close" @click="showDeleteModal = false"></button>
					</div>
					<div class="modal-body">
						<p>
							<strong>{{ selectedPlayer?.name }} {{ selectedPlayer?.surname }}</strong> adlı oyuncuyu
							silmek istediğinize emin misiniz?
						</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" @click="showDeleteModal = false">İptal</button>
						<button type="button" class="btn btn-danger" @click="handleDelete">
							Evet, Sil
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal-backdrop fade show" v-if="showDeleteModal"></div>
	</div>
</template>

<style scoped>
.list-group-item {
	transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.list-group-item:hover {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	transform: translateY(-2px);
}

.icon {
	font-size: 22px;
}
</style>