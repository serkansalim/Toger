<template>
    <h3 class="text-2xl font-bold mb-1">Dashboard</h3>
    <p class="text-gray-600 mb-2">Dashboard > HGS Ödeme Geçişi</p>
    <div class="card p-6 bg-white rounded-xl shadow space-y-4 text-sm">
        <h5 class="text-2xl font-semibold mb-4">HGS Ödeme Geçişi</h5>
        <div class="filters">
            <input type="date" v-model="startDate" class="border px-2 py-1" />
            <input type="date" v-model="endDate" class="border px-2 py-1" />
            <select class="border border-gray-300 px-2 py-1 text-sm no-rounded">
                <option>Tümü</option>
            </select>
            <button class="border px-2 py-1 bg-gray-200 hover:bg-gray-300">
                🔽
            </button>
        </div>
        <div class="flex items-center space-x-2 ml-auto">
            <label class="text-sm">
                Sayfada
            </label>
            <select v-model="perPage" class="border px-2 py-1 rounded text-sm">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="25">25</option>
            </select>
            <span class="text-sm">kayıt göster</span>
        </div>

        <div class="overflow-x-auto mb-4">
            <table class="w-full border table-auto mt-4 ">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="p-2 border">Oluşturulma Tarihi</th>
                        <th class="p-2 border">Plaka</th>
                        <th class="p-2 border">Ödeme Tutarı</th>
                        <th class="p-2 border">Ödeme Durumu</th>
                        <th class="p-2 border">Son Deneme</th>
                        <th class="p-2 border">Ödeme ID</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in paginatedData" :key="i" class="hover:bg-gray-50">
                        <td class="p-2 border">{{ item.createdAt }}</td>
                        <td class="p-2 border">{{ item.plate }}</td>
                        <td class="p-2 border">{{ item.amount }} TL</td>
                        <td class="p-2 border">{{ item.status }}</td>
                        <td class="p-2 border">{{ item.lastTry }}</td>
                        <td class="p-2 border text-xs">{{ item.paymentId }}</td>
                        <td class="p-2 border text-center">
                            <button v-if="item.status === 'Ödendi'" class="refund-button" @click="refund(item)">
                                İade Et
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <nav class="d-flex justify-content-start">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="goToPage(1)">İlk</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="goToPage(currentPage - 1)">Önceki</button>
                </li>
                <li class="page-item active">
                    <span class="page-link">{{ currentPage }}</span>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="goToPage(currentPage + 1)">Sonraki</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="goToPage(totalPages)">Son</button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})
import { ref, computed } from 'vue'

const allData = ref([
    {
        createdAt: '2024-11-08 11:43:00',
        plate: '34KVY185',
        amount: 36,
        status: 'Ödendi',
        lastTry: '2024-11-08 11:43:01',
        paymentId: '80000050202024110811424800'

    },
    {
        createdAt: '2024-11-08 11:24:27',
        plate: '59EGS54',
        amount: 36,
        status: 'Hatalı - Ürün Sisteme Tanımlı Değil',
        lastTry: '2024-11-08 12:24:19',
        paymentId: '80000050202024110812193000'
    },
    {
        createdAt: '2024-11-07 22:34:27',
        plate: '34LIU271',
        amount: 36,
        status: 'Hatalı - Ürün Kara Listede',
        lastTry: '2024-11-07 22:35:48',
        paymentId: '80000050202024110722350000'
    }
])

const startDate = ref('')
const endDate = ref('')
const searchPlate = ref('')
const filteredData = ref([...allData.value])

const currentPage = ref(1)
const perPage = 10
const totalPages = computed(() => Math.ceil(filteredData.value.length / perPage))
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredData.value.slice(start, start + perPage)
})

const prevPage = () => currentPage.value--
const nextPage = () => currentPage.value++

function applyFilters() {
    let data = [...allData.value]
    if (searchPlate.value) {
        data = data.filter(d => d.plate.toLowerCase().includes(searchPlate.value.toLowerCase()))
    }
    if (startDate.value) {
        data = data.filter(d => new Date(d.createdAt) >= new Date(startDate.value))
    }
    if (endDate.value) {
        data = data.filter(d => new Date(d.createdAt) <= new Date(endDate.value))
    }
    filteredData.value = data
    currentPage.value = 1
}
</script>

<style scoped>
.flex.flex-wrap.gap-4.items-center {
    margin-left: 2px;
    margin-top: 15px;
}

.refund-button {
	width: 108%;
	background-color: #dc3545;
	color: white;
	padding: 6px 10px;
	border: none;
	border-radius: 4px;
	font-weight: bold;
	cursor: pointer;
	font-size: 14px;
    margin-left: 0px;
}

.refund-button:hover {
    background-color: #c82333;
}

.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-bottom: 1rem;
}
</style>
