<template>
  <div class="container-fluid my-md-5">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <p class="text-gray-600 mb-2">Dashboard > Fiyat Tarifesi</p>

    <div class="card p-3">
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 class="mb-0">Fiyat Tarifesi</h4>
        <button class="btn btn-success">Yeni Ekle</button>
      </div>

      <div class="mb-3">
        <label>
          Sayfada
          <select v-model="perPage" class="form-select d-inline-block w-auto mx-0 form-select-sm custom-select-fix">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
          </select>
          kayıt göster
        </label>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-sm-2 w-100">
          <thead class="table-light">
            <tr>
              <th>Ad</th>
              <th>Araç Gövde Tipi</th>
              <th>Başlangıç (dk)</th>
              <th>Bitiş (dk)</th>
              <th>Fiyat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedItems" :key="item.id">
              <td class="align-middle text-nowrap">{{ item.ad }}</td>
              <td class="align-middle text-nowrap">{{ item.tip }}</td>
              <td class="align-middle text-nowrap">{{ item.baslangic }}</td>
              <td class="align-middle text-nowrap">{{ item.bitis }}</td>
              <td class="align-middle text-nowrap">{{ item.fiyat }} ₺</td>
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
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, computed } from 'vue'

const tarifeler = ref([
  { id: 1, ad: '0 - 1 Saat', tip: 'Varsayılan', baslangic: 0, bitis: 60, fiyat: 36 },
  { id: 2, ad: '1 - 3 Saat', tip: 'Varsayılan', baslangic: 60, bitis: 180, fiyat: 45 },
  { id: 3, ad: '3 - 7 Saat', tip: 'Varsayılan', baslangic: 180, bitis: 420, fiyat: 58 },
  { id: 4, ad: '7 - 10 Saat', tip: 'Varsayılan', baslangic: 420, bitis: 660, fiyat: 73 },
  { id: 5, ad: 'Tam Gün', tip: 'Varsayılan', baslangic: 660, bitis: 1440, fiyat: 112 },
])

const perPage = ref(10)
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(tarifeler.value.length / perPage.value))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return tarifeler.value.slice(start, start + perPage.value)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style scoped>
.page-item:not(.active) .page-link {
  border: none;
  background: transparent;
  box-shadow: none;
  color: #0c0c0c;
}

.page-item.active .page-link {
  background-color: #f1f1f1;
  border-color: #d7d8d8;
  color: rgb(0, 0, 0);
}

.custom-select-fix {
  padding-right: 2rem !important;
  min-width: 60px;
}

td {
  white-space: nowrap;
  vertical-align: middle;
}

@media (max-width: 768px) {
  td {
    font-size: 13px;
  }
}
</style>
