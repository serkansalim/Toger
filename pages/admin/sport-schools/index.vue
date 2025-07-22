<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { watchDebounced } from '@vueuse/core'
import { useSportSchoolRepository } from '~/repositories/SportSchoolRepository'
import type { SportSchool } from '~/types/sportSchool/SportSchool'
import { normalizeFilters } from '~/utils/normalizeFilters'

const { getAllSportSchools } = useSportSchoolRepository()
const sportSchools = ref<SportSchool[]>([])
const page = ref(1)
const total = ref(0)
const limit = 10

const filters = ref({
    coachName: null,
    ageGroup: null,
    name: null
})

const fetchSportSchools = async () => {
    const res = await getAllSportSchools({
        page: page.value,
        limit,
        ...normalizeFilters(filters.value)
    })
    sportSchools.value = res.data
    total.value = res.total
}

onMounted(fetchSportSchools)

watch(page, fetchSportSchools)
watchDebounced(filters, () => {
    page.value = 1
    fetchSportSchools()
}, {
    debounce: 400,
    deep: true
})

</script>

<template>
    <div class="container py-4">
        <h2 class="mb-4">Spor Okulları</h2>
        <NuxtLink to="/admin/sport-schools/add" class="btn btn-success mb-3">+ Yeni Spor Okulu</NuxtLink>

        <div class="row g-2 mb-3">
            <div class="col-md-3">
                <input v-model="filters.coachName" type="text" class="form-control"
                    placeholder="Antrenör (ör: Fatih Terim)" />
            </div>

            <div class="col-md-3">
                <input v-model="filters.ageGroup" type="text" class="form-control" placeholder="Yaş (ör: 19)" />
            </div>

            <div class="col-md-3">
                <input v-model="filters.name" type="text" class="form-control" placeholder="Spor okulu adı (ör: U19)" />
            </div>

            <div class="col-md-2 d-flex align-items-start">
                <button @click="filters = { coachName: null, ageGroup: null, name: null }"
                    class="btn btn-outline-secondary w-100">
                    Temizle
                </button>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 col-lg-4 mb-4" v-for="sportSchool in sportSchools" :key="sportSchool.id">
                <div class="card shadow-sm h-100 border-0">
                    <div class="card-body">
                        <h5 class="card-title text-primary fw-bold">
                            {{ sportSchool.name }}
                        </h5>
                        <p class="mb-1"><strong>Yaş Grubu:</strong> {{ sportSchool.ageGroup }}</p>
                        <p class="mb-3"><strong>Antrenör:</strong> {{ sportSchool.coachName || '-' }}</p>
                        
                        <NuxtLink :to="`/admin/sport-schools/${sportSchool.id}/edit`" class="btn btn-sm btn-primary">
                            Düzenle
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <Pagination v-model="page" :total="total" :limit="limit" />
    </div>
</template>
