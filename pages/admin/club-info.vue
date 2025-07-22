<template>
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">
    <!-- Filtre Butonları -->
    <div class="flex flex-wrap gap-3">
      <button v-for="type in filterTypes" :key="type"
        @click="selectedFilter = type"
        :class="[
          'px-4 py-2 rounded-md font-semibold',
          selectedFilter === type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        ]">
        {{ type }}
      </button>
    </div>

    <!-- Sayısal Kartlar -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
      <div class="bg-white p-6 rounded-xl shadow">
        <div class="text-lg text-gray-600">Tamamlanan Parklar</div>
        <div class="text-4xl font-bold mt-2 text-gray-800">{{ completedParks }}</div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow">
        <div class="text-lg text-gray-600">Ciro</div>
        <div class="text-4xl font-bold mt-2 text-green-600">{{ revenue }} TL</div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow">
        <div class="text-lg text-gray-600">Kazanç (Başarılı çekimler)</div>
        <div class="text-4xl font-bold mt-2 text-indigo-600">{{ profit }} TL</div>
      </div>
    </div>

    <!-- Grafik Alanı -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-xl shadow">
        <h3 class="text-lg font-semibold mb-2 text-gray-700">Tamamlanan Parklar</h3>
        <img src="/dummy-graph-1.png" alt="Tamamlanan Parklar Grafiği" class="w-full h-64 object-contain opacity-50">
      </div>
      <div class="bg-white p-4 rounded-xl shadow">
        <h3 class="text-lg font-semibold mb-2 text-gray-700">Ödemeler</h3>
        <img src="/dummy-graph-2.png" alt="Ödemeler Grafiği" class="w-full h-64 object-contain opacity-50">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filterTypes = ['Günlük', 'Haftalık', 'Aylık', 'Özel Tarih']
const selectedFilter = ref('Günlük')

// Dummy veriler
const completedParks = 84
const revenue = 216
const profit = 108
</script>
