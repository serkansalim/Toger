<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useTeamRepository } from '~/repositories/TeamRepository'
import type { CreateTeamDto } from '~/types/team/CreateTeamDto'

const { create } = useTeamRepository()
const router = useRouter()
const { showToast } = useToast()

const form = ref<CreateTeamDto>({
    name: '',
    ageGroup: '', // örn: U12, U13
    football_club_id: 1 // örnek id, login'den alınmalı
})

let loading = ref(false)

const handleSubmit = async () => {
    loading.value = true;
    await create(form.value)
    loading.value = false;
    showToast('✅ Takım başarıyla eklendi!', 'success')
    router.push('/admin/teams')
}
</script>

<template>
    <div class="container py-4">
        <NuxtLink to="/admin/teams" class="mb-3 d-block">
            <i class="fas fa-arrow-left me-2"></i> Takımlar
        </NuxtLink>

        <h2>Yeni Takım Ekle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Takım Adı</label>
                <input v-model="form.name" type="text" placeholder="örnek: Kartallar U13" class="form-control"
                    required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Yaş Grubu</label>
                <input v-model="form.ageGroup" type="text" placeholder="örnek: U12" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Antrenör</label>
                <input v-model="form.coachName" type="text" placeholder="örnek: Fatih Terim" class="form-control" required />
            </div>

            <div class="col-12">
                <button type="submit" :disabled="loading" class="btn btn-success">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Kaydet
                </button>
            </div>
        </form>
    </div>
</template>
