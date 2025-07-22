<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'

import { usePaymentRepository } from '~/repositories/PaymentRepository'
import { usePlayerRepository } from '~/repositories/PlayerRepository'
import { useParentRepository } from '~/repositories/ParentRepository'

import type { Payment } from '~/types/payment/Payment'
import type { Player } from '~/types/player/Player'
import type { Parent } from '~/types/parent/Parent'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

const { getById, update } = usePaymentRepository()
const { getAll: getPlayers } = usePlayerRepository()
const { getAllParents } = useParentRepository()

const paymentId = Number(route.params.id)

const loading = ref(false)
const players = ref<Player[]>([])
const parents = ref<Parent[]>([])

const form = ref<Partial<Payment>>({
    id: paymentId,
    amount: null,
    date: null,
    description: '',
    isPaid: false,
    player: { id: null },
    parent: { id: null },
})

onMounted(async () => {
    const [resPlayers, resParents, resPayment] = await Promise.all([
        getPlayers({ page: 1, limit: 1000 }),
        getAllParents({ page: 1, limit: 1000 }),
        getById(paymentId),
    ])

    players.value = resPlayers.data
    parents.value = resParents.data

    if (resPayment) {
        form.value = {
            id: resPayment.id,
            amount: resPayment.amount,
            date: resPayment.date?.slice(0, 10), // yyyy-mm-dd
            description: resPayment.description,
            isPaid: resPayment.isPaid,
            player: { id: resPayment.player?.id },
            parent: { id: resPayment.parent?.id },
        }
    } else {
        // showToast('⚠️ Aidat bulunamadı.', 'warning')
        // router.push('/admin/payments')
    }
})

const handleSubmit = async () => {
    loading.value = true
    try {
        const result = await update(paymentId, form.value)
        if (result.success) {
            showToast('✅ Aidat güncellendi!', 'success')
            router.push('/admin/payments')
        } else {
            showToast(result.message || 'Bir hata oluştu', 'error')
        }
    } catch (error: any) {
        const msg = error?.response?.data?.message || error.message || 'Bilinmeyen hata'
        showToast(`❌ ${msg}`, 'danger')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="container py-4">
        <NuxtLink class="mb-4 float-start w-100" to="/admin/payments">
            <i class="fas fa-arrow-left me-2"></i> Aidatlar
        </NuxtLink>

        <h2 class="mb-4">Aidat Düzenle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Oyuncu</label>
                <select v-model.number="form.player.id" class="form-select" required>
                    <option disabled value="0">Oyuncu seçin...</option>
                    <option v-for="player in players" :key="player.id" :value="player.id">
                        {{ player.name }} {{ player.surname }}
                    </option>
                </select>
            </div>

            <div class="col-md-4">
                <label class="form-label">Veli</label>
                <select v-model.number="form.parent.id" class="form-select" required>
                    <option disabled value="0">Veli seçin...</option>
                    <option v-for="parent in parents" :key="parent.id" :value="parent.id">
                        {{ parent.name }}
                    </option>
                </select>
            </div>

            <div class="col-md-4">
                <label class="form-label">Tutar (₺)</label>
                <input v-model.number="form.amount" type="number" class="form-control" required />
            </div>

            <div class="col-md-4">
                <label class="form-label">Tarih</label>
                <input v-model="form.date" type="date" class="form-control" required />
            </div>

            <div class="col-md-4">
                <label class="form-label">Durum</label>
                <select v-model="form.isPaid" class="form-select" required>
                    <option :value="true">Ödendi</option>
                    <option :value="false">Ödenmedi</option>
                </select>
            </div>

            <div class="col-md-8">
                <label class="form-label">Açıklama</label>
                <textarea v-model="form.description" class="form-control" rows="2"
                    placeholder="Opsiyonel açıklama..."></textarea>
            </div>

            <div class="col-12">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Güncelle
                </button>
            </div>
        </form>
    </div>
</template>
