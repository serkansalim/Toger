<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { watchDebounced } from '@vueuse/core'
import { useTeamRepository } from '~/repositories/TeamRepository'
import type { Team } from '~/types/team/Team'
import { normalizeFilters } from '~/utils/normalizeFilters'

const { getAll } = useTeamRepository()
const teams = ref<Team[]>([])
const page = ref(1)
const total = ref(0)
const limit = 10

const filters = ref({
    coachName: null,
    ageGroup: null,
    name: null
})

const fetchTeams = async () => {
    const res = await getAll({
        page: page.value,
        limit,
        ...normalizeFilters(filters.value)
    })
    teams.value = res.data
    total.value = res.total
}

onMounted(fetchTeams)

watch(page, fetchTeams)
watchDebounced(filters, () => {
    page.value = 1
    fetchTeams()
}, {
    debounce: 400,
    deep: true
})

</script>

<template>
    <div class="container py-4">
        <h2 class="mb-4">Takımlar</h2>
        <NuxtLink to="/admin/teams/add" class="btn btn-success mb-3">+ Yeni Takım</NuxtLink>

        <div class="row g-2 mb-3">
            <div class="col-md-3">
                <input v-model="filters.coachName" type="text" class="form-control"
                    placeholder="Antrenör (ör: Fatih Terim)" />
            </div>

            <div class="col-md-3">
                <input v-model="filters.ageGroup" type="text" class="form-control" placeholder="Yaş (ör: 19)" />
            </div>

            <div class="col-md-3">
                <input v-model="filters.name" type="text" class="form-control" placeholder="Takım adı (ör: U19)" />
            </div>

            <div class="col-md-2 d-flex align-items-start">
                <button @click="filters = { coachName: null, ageGroup: null, name: null }"
                    class="btn btn-outline-secondary w-100">
                    Temizle
                </button>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 col-lg-4 mb-4" v-for="team in teams" :key="team.id">
                <div class="card shadow-sm h-100 border-0">
                    <div class="card-body">
                        <h5 class="card-title text-primary fw-bold">
                            {{ team.name }}
                        </h5>
                        <p class="mb-1"><strong>Yaş Grubu:</strong> {{ team.ageGroup }}</p>
                        <p class="mb-3"><strong>Antrenör:</strong> {{ team.coachName || '-' }}</p>
                        
                        <NuxtLink :to="`/admin/teams/${team.id}/edit`" class="btn btn-sm btn-primary">
                            Düzenle
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <Pagination v-model="page" :total="total" :limit="limit" />
    </div>
</template>
