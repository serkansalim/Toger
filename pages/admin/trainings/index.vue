<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})
import { ref, onMounted, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useTrainingRepository } from '~/repositories/TrainingRepository'
import { useTeamRepository } from '~/repositories/TeamRepository'
import { normalizeFilters } from '~/utils/normalizeFilters'
import type { Training } from '~/types/training/Training'
import type { Team } from '~/types/team/Team'

const { getAll: getTrainings } = useTrainingRepository()
const { getAll: getTeams } = useTeamRepository()

const trainings = ref<Training[]>([])
const teams = ref<Team[]>([])
const loading = ref(true)

const page = ref(1)
const total = ref(0)
const limit = 10

const filters = ref({
    teamId: null,
    search: null
})

const fetchTrainings = async () => {
    loading.value = true
    const res = await getTrainings({
        page: page.value,
        limit,
        ...normalizeFilters(filters.value)
    })
    trainings.value = res.data
    total.value = res.total
    loading.value = false
}

onMounted(async () => {
    const teamRes = await getTeams({ page: 1, limit: 1000 })
    teams.value = teamRes.data
    await fetchTrainings()
})

watch(page, fetchTrainings)
watchDebounced(filters, () => {
    page.value = 1
    fetchTrainings()
}, {
    debounce: 400,
    deep: true
})
</script>

<template>
    <div class="container py-4">
        <h2 class="mb-4">Antremanlar</h2>

        <NuxtLink to="/admin/trainings/add" class="btn btn-success mb-3">
            + Yeni Antreman Ekle
        </NuxtLink>
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
                <input v-model="filters.dateFrom" type="date" class="form-control" placeholder="Başlangıç Tarihi" />
            </div>

            <div class="col-md-2 d-flex align-items-start">
                <button @click="filters = { teamId: null, position: null, search: null }"
                    class="btn btn-outline-secondary w-100">
                    Temizle
                </button>
            </div>
        </div>

        <div v-if="loading">Yükleniyor...</div>
        <div v-else class="row">
            <div class="col-md-6 col-lg-4 mb-4" v-for="training in trainings" :key="training.id">
                <div class="card shadow-sm h-100 border-0">
                    <div class="card-body">
                        <h5 class="card-title text-primary">
                            {{ new Date(training.date).toLocaleDateString('tr-TR') }}
                        </h5>
                        <p class="mb-1"><strong>Lokasyon:</strong> {{ training.title || '-' }}</p>
                        <p class="mb-1"><strong>Takım:</strong> {{ training.team?.name || '-' }}</p>
                        <p class="mb-2"><strong>Not:</strong> {{ training.description || '-' }}</p>

                        <div class="d-flex gap-2">
                            <NuxtLink :to="`/admin/trainings/${training.id}/edit`" class="btn btn-sm btn-primary">
                                Düzenle
                            </NuxtLink>
                            <NuxtLink :to="`/admin/trainings/${training.id}/attendance`" class="btn btn-sm btn-warning">
                                Yoklama Al
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Pagination v-model="page" :total="total" :limit="limit" />
    </div>
</template>
