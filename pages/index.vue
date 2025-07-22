<template>
    <div class="container-fluid vh-100">
        <div class="row h-100">
            <!-- Sol: Giriş Formu -->
            <div class="col-md-6 d-flex align-items-center justify-content-center bg-white px-5" id="admin-login">
                <div class="w-100 bg-white rounded px-4 py-3" style="max-width: 400px;">
                    <h3 class="mb-4 fw-bold text-center">Yönetici Girişi</h3>

                    <form @submit.prevent="handleLogin">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email adresi</label>
                            <input type="email" class="form-control" id="email" v-model="email" required />
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Şifre</label>
                            <input type="password" class="form-control" id="password" v-model="password" required />
                        </div>

                        <button type="submit" :disabled="loading" class="btn btn-primary w-100">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                                aria-hidden="true"></span>
                            {{ loading ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}
                        </button>

                        <p class="text-muted mt-3 text-center small">
                            Toger
                        </p>
                    </form>
                </div>
            </div>

            <!-- Sağ: Görsel -->
            <div class="col-md-6 d-none d-md-block p-0">
                <img src="/Data/hero.jpg" alt="Giriş görseli" class="img-fluid h-100 w-100 object-fit-cover" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'empty'
})

import { ref } from 'vue'

const { showToast } = useToast()
const router = useRouter()
const email = ref('admin@admin.com')
const password = ref('123456')
const loading = ref(false)

const handleLogin = async () => {
    loading.value = true;
    try {
        if(email.value == 'admin@admin.com' && password.value == '123456') {
           showToast('Giriş başarılı', 'success')
            router.push('/admin') 
        }
        else {
            showToast('E-mail ve Şifre hatalı.', 'danger')
        }
    }
    catch (error) {
        showToast('Bir hata oluştu!', 'danger')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.object-fit-cover {
    object-fit: cover;
}

@media screen and (max-width: 767px) {
    #admin-login {
        background: url(/Data/hero.jpg) no-repeat center;
        background-size: cover;
    }
}
</style>
