<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserRepository } from '~/repositories/UserRepository'
import type { UpdateUserDto } from '~/types/user/UpdateUserDto'
import { UserRole } from '~/types/user/UserRole' // enum importu

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { getById, update } = useUserRepository()
const { showToast } = useToast()

const loading = ref(false)
const form = ref<UpdateUserDto>({
    name: null,
    email: null,
    password: null,
    role: UserRole.COACH
})

const roles = Object.entries(UserRole)

onMounted(async () => {
    const user = await getById(id)
    form.value = {
        name: user.name,
        email: user.email,
        role: user.role
    }
})

const handleSubmit = async () => {
    loading.value = true
    try {
        const result = await update(id, form.value)
        if (result.success) {
            showToast('✅ Kullanıcı güncellendi!', 'success')
        } else {
            showToast(result.message || 'Güncellenemedi', 'danger')
        }
    } catch (error: any) {
        showToast(error?.response?.data?.message || 'Sunucu hatası', 'danger')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="container py-4">
        <NuxtLink to="/admin/users" class="mb-3 d-block">
            <i class="fas fa-arrow-left me-2"></i> Kullanıcılar
        </NuxtLink>
        <h2>Kullanıcıyı Düzenle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">
            <div class="col-md-6">
                <label class="form-label">İsim</label>
                <input v-model="form.name" type="text" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Şifre</label>
                <input v-model="form.password" type="password" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Roller</label>
                <option v-for="[key, value] in roles" :key="key" :value="value">
                    {{ key }}
                </option>
            </div>

            <div class="col-md-12">
                <button type="submit" :disabled="loading" class="btn btn-primary">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Güncelle
                </button>
            </div>
        </form>
    </div>
</template>
