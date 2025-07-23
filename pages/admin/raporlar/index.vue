<template>
    <div class="card p-3">
        <h4 class="text-2xl font-bold mb-0">Dashboard</h4>
        <p class="text-gray-600 mb-4">Dashboard > HGS Onay</p>

        <div class="button-group mb-6">
            <button v-for="type in filterTypes" :key="type" @click="selectedFilter = type"
                :class="['btn', { active: selectedFilter === type }]">
                {{ type }}
            </button>
        </div>

        <div class="card-container">
            <div class="card-box">
                <div class="text-lg text-gray-600">Tamamlanan Parklar</div>
                <div class="text-4xl font-bold mt-2 text-gray-800">{{ completedParks }}</div>
            </div>

            <div class="card-box">
                <div class="text-lg text-gray-600">Ciro</div>
                <div class="text-4xl font-bold mt-2 text-green-600">{{ revenue }} TL</div>
            </div>

            <div class="card-box">
                <div class="text-lg text-gray-600">Kazanç (Başarılı çekimler)</div>
                <div class="text-4xl font-bold mt-2 text-indigo-600">{{ profit }} TL</div>
            </div>
        </div>

        <div class="combined-graph-card">
            <div class="graph-box">
                <h5 class="graph-title">Tamamlanan Parklar</h5>
                <ClientOnly>
                    <BarChart />
                </ClientOnly>
            </div>
            <div class="graph-box">
                <h5 class="graph-title">Ödemeler</h5>
                <ClientOnly>
                    <BarChart />
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin'
})

import { ref } from 'vue'
import BubbleChart from '~/components/BarChart.vue'

const filterTypes = ['Günlük', 'Haftalık', 'Aylık', 'Özel Tarih']
const selectedFilter = ref('Günlük')

const completedParks = 84
const revenue = 216
const profit = 108
</script>

<style scoped>
.button-group {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
}

.btn {
    padding: 8px 16px;
    border: 1px solid #ccc;
    background-color: #f3f4f6;
    color: #333;
    cursor: pointer;
    border-radius: 0;
    transition: all 0.2s ease;
}

.btn:hover {
    background-color: #e0f0ff;
    border-color: #60a5fa;
    color: #1d4ed8;
}

.btn.active {
    background-color: #2563eb;
    color: white;
    border-color: #2563eb;
}

.card-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.card-box {
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    text-align: center;
    flex: 1 1 250px;
}

.combined-graph-card {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-top: 30px;
    flex-wrap: wrap;
}

.graph-box {
    flex: 1 1 48%;
    text-align: start;
}

.graph-title {
    font-weight: 600;
    margin-bottom: 10px;
    color: #374151;
}

.graph-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
}
</style>