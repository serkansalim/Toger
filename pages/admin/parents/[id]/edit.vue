<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useParentRepository } from '~/repositories/ParentRepository'
import type { UpdateParentDto } from '~/types/parent/UpdateParentDto'
import type { Player } from '~/types/player/Player'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const { getById, update } = useParentRepository()

const id = Number(route.params.id)
const form = ref<UpdateParentDto>({
    name: '',
    surname: '',
    phone: '',
    email: ''
})

const players = ref<Player[]>([])

let loading = ref(false)

onMounted(async () => {
    const parent = await getById(id)
    form.value = {
        name: parent.name,
        surname: parent.surname,
        uniqueId: parent.uniqueId,
        phone: parent.phone,
        email: parent.email
    }

    players.value = parent.players
})

const handleSubmit = async () => {
    loading.value = true
    try {
        const result = await update(id, form.value)

        if (result.success) {
            showToast('✅ Veli başarıyla güncellendi!', 'success')
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
        <NuxtLink to="/admin/parents" class="mb-3 d-block">
            <i class="fas fa-arrow-left me-2"></i> Veliler
        </NuxtLink>

        <h2>Veli Düzenle</h2>

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
                <input v-model="form.uniqueId" type="text" placeholder="örnek: 88888888880" class="form-control"
                    required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Telefon Numarası</label>
                <input v-model="form.phone" type="text" placeholder="örnek: 05555555555" class="form-control"
                    required />
            </div>

            <div class="col-md-6">
                <label class="form-label">E-posta</label>
                <input v-model="form.email" type="email" placeholder="örnek: example@futbols.club" class="form-control"
                    required />
            </div>

            <div class="col-12">
                <button type="submit" :disabled="loading" class="btn btn-primary">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                        aria-hidden="true"></span>
                    Güncelle
                </button>
            </div>
        </form>

        <div class="col-12 mt-5">
            <h5>Veliye Bağlı Oyuncular</h5>

            <div v-if="players?.length">
                <ul class="list-group">
                    <li v-for="player in players" :key="player.id"
                        class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{{ player.name }} {{ player.surname }}</strong>
                            <br />
                            <small class="text-muted">Mevki: {{ player.position || 'Bilinmiyor' }}</small>
                        </div>
                        <NuxtLink :to="`/admin/players/${player.id}/edit`" class="btn btn-sm btn-outline-primary">Detay
                        </NuxtLink>
                    </li>
                </ul>
            </div>

            <p v-else class="text-muted">Bu veliye ait oyuncu bulunamadı.</p>
        </div>
    </div>
</template>
