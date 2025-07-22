<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useTeamRepository } from '~/repositories/TeamRepository'
import type { UpdateTeamDto } from '~/types/team/UpdateTeamDto'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const { getById, update } = useTeamRepository()

const id = Number(route.params.id)
const form = ref<UpdateTeamDto>({
    name: '',
    ageGroup: ''
})

let loading = ref(false)

onMounted(async () => {
    const team = await getById(id)
    form.value = {
        name: team.name,
        ageGroup: team.ageGroup,
        coachName: team.coachName,
    }
})

const handleSubmit = async () => {
    loading.value = true;
    await update(id, form.value)
    loading.value = false; 
    showToast('✅ Takım başarıyla güncellendi!', 'success')
    router.push('/admin/teams')
}
</script>

<template>
    <div class="container py-4">
        <NuxtLink to="/admin/teams" class="mb-3 d-block">
            <i class="fas fa-arrow-left me-2"></i> Takımlar
        </NuxtLink>

        <h2>Takım Düzenle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Takım Adı</label>
                <input v-model="form.name" type="text" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Yaş Grubu</label>
                <input v-model="form.ageGroup" type="text" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Antrenör</label>
                <input v-model="form.coachName" type="text" class="form-control" required />
            </div>

            <div class="col-12">
                <button type="submit" :disabled="loading" class="btn btn-primary">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Güncelle
                </button>
            </div>
        </form>
    </div>
</template>
