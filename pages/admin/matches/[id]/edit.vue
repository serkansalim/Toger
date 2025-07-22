<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useMatchRepository } from '~/repositories/MatchRepository'
import { useTeamRepository } from '~/repositories/TeamRepository'
import type { CreateMatchDto } from '~/types/match/CreateMatchDto'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { getById, update } = useMatchRepository()
const { getAll } = useTeamRepository()
const { showToast } = useToast()

const teams = ref([])
const loading = ref(false)

const form = ref<CreateMatchDto>({
    opponent: null,
    matchDate: null,
    location: null,
    isHome: true,
    result: null,
    notes: null,
    teamId: null,
    football_club_id: 1 // Giriş yapan kullanıcıdan alınmalı
})

onMounted(async () => {
    try {
        const match = await getById(id)
        form.value = {
            opponent: match.opponent,
            matchDate: match.matchDate.slice(0, 16), // datetime-local için "yyyy-MM-ddTHH:mm"
            location: match.location,
            isHome: match.isHome,
            result: match.result,
            notes: match.notes,
            teamId: match.team?.id || null,
            football_club_id: match.football_club_id
        }

        const res = await getAll({ page: 1, limit: 1000 })
        teams.value = res.data
    } catch (error) {
        showToast('Maç bilgileri alınamadı!', 'danger')
    }
})

const handleSubmit = async () => {
    loading.value = true
    try {
        const dto = {
            ...form.value,
            matchDate: new Date(form.value.matchDate).toISOString()
        }

        const result = await update(id, dto)

        if (result.success) {
            showToast('✅ Müsabaka başarıyla güncellendi!', 'success')
        } else {
            showToast(result.message || 'Hata oluştu', 'danger')
        }
    } catch (err: any) {
        console.error(err)
        showToast(err?.response?.data?.message || 'Sunucu hatası', 'danger')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="container py-4">
        <NuxtLink to="/admin/matches" class="mb-3 d-block">
            <i class="fas fa-arrow-left me-2"></i> Müsabakalar
        </NuxtLink>

        <h2>Müsabaka Düzenle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Takım Seç</label>
                <select v-model.number="form.teamId" class="form-select" required>
                    <option disabled :value="null">Takım seçiniz</option>
                    <option v-for="team in teams" :key="team.id" :value="team.id">
                        {{ team.name }} ({{ team.ageGroup }})
                    </option>
                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label">Rakip Takım</label>
                <input v-model="form.opponent" type="text" class="form-control" placeholder="örnek: Galatasaray"
                    required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Tarih</label>
                <input v-model="form.matchDate" type="datetime-local" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Saha / Stat</label>
                <input v-model="form.location" type="text" class="form-control" placeholder="örnek: Gebze Sahası"
                    required />
            </div>

            <div class="col-md-3">
                <label class="form-label">Ev Sahibi?</label>
                <select v-model="form.isHome" class="form-select">
                    <option :value="true">Evet</option>
                    <option :value="false">Hayır (Deplasman)</option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="form-label">Skor (isteğe bağlı)</label>
                <input v-model="form.result" type="text" class="form-control" placeholder="örnek: 2-1" />
            </div>

            <div class="col-md-12">
                <label class="form-label">Notlar</label>
                <textarea v-model="form.notes" class="form-control" rows="3" placeholder="Notlar..."></textarea>
            </div>

            <div class="col-md-12">
                <button type="submit" :disabled="loading" class="btn btn-primary">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Güncelle
                </button>
            </div>
        </form>
    </div>
</template>
