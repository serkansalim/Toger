<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useSportSchoolRepository } from '~/repositories/SportSchoolRepository'
import type { CreateSportSchoolDto } from '~/types/sportSchool/CreateSportSchoolDto'

const { create } = useSportSchoolRepository()
const router = useRouter()
const { showToast } = useToast()

const form = ref<CreateSportSchoolDto>({
    name: '',
    ageGroup: '', // örn: U12, U13
    coachName: '',
    location: '',
    description: '',
    isActive: false,
    football_club_id: 1 // örnek id, login'den alınmalı
})

let loading = ref(false)

const handleSubmit = async () => {
    loading.value = true;
    await create(form.value)
    loading.value = false;
    showToast('✅ Spor Okulu başarıyla eklendi!', 'success')
    router.push('/admin/sport-schools')
}
</script>

<template>
    <div class="container py-4">
        <NuxtLink to="/admin/sport-schools" class="mb-3 d-block">
            <i class="fas fa-arrow-left me-2"></i> Spor Okulları
        </NuxtLink>

        <h2>Yeni Spor Okulu Ekle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Spor Okulu Adı</label>
                <input v-model="form.name" type="text" placeholder="örnek: Kartallar U13" class="form-control"
                    required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Lokasyon</label>
                <input v-model="form.location" type="text" placeholder="örnek: Maslak" class="form-control" />
            </div>

            <div class="col-md-4">
                <label class="form-label">Yaş Grubu</label>
                <input v-model="form.ageGroup" type="text" placeholder="örnek: U12" class="form-control" />
            </div>

            <div class="col-md-4">
                <label class="form-label">Antrenör</label>
                <input v-model="form.coachName" type="text" placeholder="örnek: Fatih Terim" class="form-control" />
            </div>

            <div class="col-md-4">
                <label class="form-label">Durum</label>
                <select v-model="form.isActive" class="form-select">
                    <option :value="true">Aktif</option>
                    <option :value="false">Pasif</option>
                </select>
            </div>

            <div class="col-12">
                <label class="form-label">Açıklama</label>
                <textarea v-model="form.description" placeholder="Açıklama girebilirsiniz.." class="form-control" ></textarea>
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
