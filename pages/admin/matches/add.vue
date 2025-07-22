<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useMatchRepository } from '~/repositories/MatchRepository'
import { useTeamRepository } from '~/repositories/TeamRepository'
import type { CreateMatchDto } from '~/types/match/CreateMatchDto'

const router = useRouter()
const { showToast } = useToast()
const { create } = useMatchRepository()
const { getAll } = useTeamRepository()

const teams = ref([])
const loading = ref(false)

const form = ref<CreateMatchDto>({
    opponent: null,
    matchDate: null,
    location: null,
    isHome: true,
    result: null,
    notes: null,
    teamId: null
})

onMounted(async () => {
    const res = await getAll({ page: 1, limit: 1000 })
    teams.value = res.data
})


const handleSubmit = async () => {
    loading.value = true;

    try {
        form.value.matchDate = new Date(form.value.matchDate).toISOString()
        const result = await create(form.value);
        // Başarı kontrolü (eğer wrapper varsa)
        if (result.success === true) {
            showToast('✅ Müsabaka başarıyla oluşturuldu!', 'success');
            router.push('/admin/matches');
            loading.value = false;
            return;
        }
        showToast(result?.message || 'Bir hata oluştu', 'error');
        loading.value = false;

    } 
    catch (error: any) {
        console.error('Create Match Error:', error);

        // Axios hataları genellikle burada olur
        const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Bilinmeyen bir hata oluştu';

        showToast(`❌ ${message}`, 'danger');
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <div class="container py-4">
        <NuxtLink to="/admin/matches" class="mb-3 d-block">
            <i class="fas fa-arrow-left me-2"></i> Müsabakalar
        </NuxtLink>

        <h2>Yeni Müsabaka Ekle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Takım Seç</label>
                <select v-model.number="form.teamId" class="form-select" required>
                    <option :value=null disabled>Takım seçiniz</option>
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
                <label class="form-label">Notlar (isteğe bağlı)</label>
                <textarea v-model="form.notes" class="form-control" rows="3" placeholder="Notlar..."></textarea>
            </div>

            

            <div class="col-md-12">
                <button type="submit" :disabled="loading" class="btn btn-success">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                        aria-hidden="true"></span>
                    Kaydet
                </button>
            </div>
        </form>
    </div>
</template>
