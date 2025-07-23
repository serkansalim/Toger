<template>
    <div>
        <aside class="sidebar" :class="{ open: isSidebarOpen }">
            <span class="menu-toggle-close" @click="toggleSidebar">&times;</span>
            <nav class="menu mb-5">
                <NuxtLink to="/admin/dashboard" class="menu-item" @click="isSidebarOpen=false">🏠 Dashboard</NuxtLink>
                <NuxtLink to="/admin/kullanicilar" class="menu-item" @click="isSidebarOpen=false">👥 Kullanıcılar</NuxtLink>
                <NuxtLink to="/admin/fiyat-tarifesi" class="menu-item" @click="isSidebarOpen=false">💰 Fiyat Tarifesi</NuxtLink>
                <NuxtLink to="/admin/park-oturumlari" class="menu-item" @click="isSidebarOpen=false">🅿️ Park Oturumları</NuxtLink>
                <NuxtLink to="/admin/beyaz-liste" class="menu-item" @click="isSidebarOpen=false">📄 Beyaz Liste</NuxtLink>
                <NuxtLink to="/admin/hgs-onay" class="menu-item" @click="isSidebarOpen=false">🚗 HGS Onay</NuxtLink>
                <NuxtLink to="/admin/hgs-odeme-gec" class="menu-item" @click="isSidebarOpen=false">🚗 HGS Ödeme Geç</NuxtLink>
                <NuxtLink to="/admin/raporlar" class="menu-item" @click="isSidebarOpen=false">📑 Raporlar</NuxtLink>

            </nav>
        </aside>

        <div v-if="isSidebarOpen" class="admin-mobile-backdrop" @click="isSidebarOpen = false"></div>

        <!-- Main Area -->
        <div class="main-content">
            <!-- Header -->
            <header class="admin-header">
                <button class="menu-toggle" @click="toggleSidebar">☰</button>
                <div class="user-info">
                    <span>👤 {{ user?.name || '' }}</span>
                    <button class="logout-btn" @click="logout">Çıkış</button>
                </div>
            </header>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const router = useRouter()
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const logout = () => {
    router.push('/admin/giris') 
}
</script>

<style scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f6f8fa;
}

/* Sidebar */
.sidebar {
    width: 220px;
    background-color: #0b1f3a;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 20px 10px;
    position: fixed;
    height: 100vh;
    transition: transform 0.3s ease-in-out;
}



/* Mobilde sidebar kapalı başlar */
@media (max-width: 991px) {
    .sidebar {
        transform: translateX(-100%);
        z-index: 1050;
        padding-top: 5px;
    }

    .sidebar.open {
        transform: translateX(0);
    }

    .admin-mobile-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1049; /* Menüden 1 düşük olmalı */
    }
}

/* Logo */
.logo img {
    max-height: 50px;
}

/* Menü */
.menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 100%;
    overflow: auto;
}

.menu-item {
    padding: 10px 15px;
    border-radius: 6px;
    color: #fff;
    text-decoration: none;
    font-weight: 500;
}

.menu-item:hover {
    background-color: #1e3a8a;
}

/* Main content */
.main-content {
    margin-left: 220px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

@media (max-width: 991px) {
    .main-content {
        margin-left: 0;
    }
}

/* Header */
.admin-header {
    background-color: #ffffff;
    padding: 1rem 2rem;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: end;
    align-items: center;
}

/* Menü Toggle Butonu */
.menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 26px;
    cursor: pointer;
}

.menu-toggle-close {
    display: none;
    float: right;
    color: #fff;
    font-size: 36px;
    margin-bottom: 20px;
    text-align: right;
    line-height: 20px;
    font-weight: 100;
}

@media (max-width: 991px) {
    .menu-toggle, .menu-toggle-close {
        display: block;
    }

    .admin-header {
        padding: 1rem .5rem;
        justify-content: space-between;
    }
}

.user-info {
    display: flex;
    gap: 20px;
    align-items: center;
}

.logout-btn {
    background-color: #e53935;
    border: none;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
}

.logout-btn:hover {
    background-color: #c62828;
}

/* Page content */
.page-content {
    padding: 2rem;
}

@media (max-width: 991px) {
    /* Page content */
    .page-content {
        padding: .5rem;
    }
}
</style>