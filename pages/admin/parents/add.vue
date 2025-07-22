<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useParentRepository } from '~/repositories/ParentRepository'
import type { CreateParentDto } from '~/types/parent/CreateParentDto'

const { create } = useParentRepository()
const router = useRouter()
const { showToast } = useToast()

const form = ref<CreateParentDto>({
    name: '',
    surname: '',
    uniqueId: '',
    phone: '',
    email: '',
    football_club_id: 1 // bu değer login sonrası dinamik alınmalı
})

let loading = ref(false)

const handleSubmit = async () => {
    loading.value = true
    await create(form.value)
    loading.value = false
    showToast('✅ Veli başarıyla eklendi!', 'success')
    router.push('/admin/parents')
}
</script>


<template>
    <div class="container py-4">
        <NuxtLink to="/admin/parents" class="mb-3 d-block">
            <i class="fas fa-arrow-left me-2"></i> Veliler
        </NuxtLink>

        <h2>Yeni Veli Ekle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Ad</label>
                <input v-model="form.name" type="text" placeholder="örnek: Serkan" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Soyad</label>
                <input v-model="form.surname" type="text" placeholder="örnek: Şahin" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Tc Kimlik</label>
                <input v-model="form.uniqueId" type="text" placeholder="örnek: 88888888880" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Telefon Numarası</label>
                <input v-model="form.phone" type="text" placeholder="örnek: 05001234567" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">E-posta</label>
                <input v-model="form.email" type="email" placeholder="örnek: ayse@example.com" class="form-control" required />
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
