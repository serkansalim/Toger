<template>
    <div class="container-fluid my-md-5">
        <div class="p-6 bg-gray-100 min-h-screen">
            <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
            <p class="text-gray-600 mb-2">Dashboard > Park Oturumları</p>
    
            <div class="bg-white rounded shadow p-4">
                <h2 class="text-lg font-semibold mb-4">Park Oturumları</h2>
    
                <!-- Filtre ve Sayfa Seçimi -->
                <div class="filter-bar">
                    <input type="text" placeholder="Başlangıç" class="filter-input" />
                    <input type="text" placeholder="Bitiş" class="filter-input" />
                    <select class="filter-input">
                        <option>Tümü</option>
                    </select>
                    <select class="filter-input">
                        <option>Tümü</option>
                    </select>
                    <button class="filter-input">🔽</button>
                </div>
                <div class="flex items-center space-x-2 ml-auto mb-4">
                    <label class="text-sm">
                        Sayfada
                        <select class="border border-gray-300 rounded px-2 py-1 text-sm">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        kayıt göster
                    </label>
                </div>
    
                <!-- Tablo -->
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm border border-gray-300">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="p-2 border">ID</th>
                                <th class="p-2 border">Plaka</th>
                                <th class="p-2 border">Araç Gövde Tipi</th>
                                <th class="p-2 border">Başlangıç Tarihi</th>
                                <th class="p-2 border">Bitiş Tarihi</th>
                                <th class="p-2 border">Park Süresi</th>
                                <th class="p-2 border">Ödeme Tutarı</th>
                                <th class="p-2 border">Ödeme Durumu</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in records" :key="item.id" class="text-center">
                                <td class="p-2 border">{{ item.id }}</td>
                                <td class="p-2 border">{{ item.plate }}</td>
                                <td class="p-2 border">{{ item.type }}</td>
                                <td class="p-2 border">{{ item.start }}</td>
                                <td class="p-4 border text-gray-500 italic">{{ item.end }}</td>
                                <td class="p-4 border text-gray-500 italic">{{ item.duration }}</td>
                                <td class="p-4 border text-gray-500 italic">{{ item.status }}</td>
                                <td class="p-4 border text-gray-500 italic">{{ item.status }}</td>
                                <td class="p-4 border">
                                    <img :src="item.image" alt="Araç Foto" class="w-20 h-auto mx-auto rounded" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
const records = [
    {
        id: 242598,
        plate: '34BVF512',
        type: 'Sedan',
        start: '08-11-2024 11:45:00',
        end: 'Devam Ediyor',
        duration: 'Devam Ediyor',
        payment: '',
        image: '/car1.jpg',
    },
    {
        id: 242597,
        plate: '34DUJ8555',
        type: 'Van',
        start: '08-11-2024 11:43:12',
        end: 'Devam Ediyor',
        duration: 'Devam Ediyor',
        payment: '',
        image: '/car2.jpg',
    },
];
</script>

<style>
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
}

.filter-input {
    padding: 6px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
}
</style>