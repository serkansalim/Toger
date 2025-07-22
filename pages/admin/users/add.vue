<script setup lang="ts">
definePageMeta({ 
    layout: 'admin'
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserRepository } from '~/repositories/UserRepository'
import type { CreateUserDto } from '~/types/user/CreateUserDto'
import { UserRole } from '~/types/user/UserRole' // enum importu

const router = useRouter()
const { create } = useUserRepository()
const { showToast } = useToast()

const loading = ref(false)
const form = ref<CreateUserDto>({
    name: null,
    email: null,
    password: null,
    role: UserRole.COACH // default rol
})

// Enum'u v-for'da kullanabilmek için Object.entries ile dönüştürüyoruz
const roles = Object.entries(UserRole)

const handleSubmit = async () => {
    loading.value = true
    try {
        const result = await create(form.value)
        if (result.success) {
            showToast('✅ Kullanıcı başarıyla oluşturuldu!', 'success')
            router.push('/admin/users')
        } else {
            showToast(result.message || 'Hata oluştu', 'danger')
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
        <h2>Yeni Kullanıcı Ekle</h2>

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
                <select v-model="form.role" class="form-select">
                    <option v-for="[key, value] in roles" :key="key" :value="value">
                        {{ key }}
                    </option>
                </select>
            </div>

            <div class="col-md-12">
                <button type="submit" :disabled="loading" class="btn btn-success">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Kaydet
                </button>
            </div>
        </form>
    </div>
</template>
