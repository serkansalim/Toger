<template>
	<div class="container my-5">
		<div class="card">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h4>Kullanıcılar</h4>
				<button class="btn btn-success"> Yeni Ekle</button>
			</div>

			<div class="mb-2">
				<label>
					Sayfada
					<select v-model="perPage"
						class="form-select d-inline-block w-auto mx-0 form-select-sm custom-select-fix">
						<option :value="5">5</option>
						<option :value="10">10</option>
						<option :value="25">25</option>
					</select>
					kayıt göster
				</label>
			</div>

			<div class="table-responsive">
				<table class="table table-bordered">
					<thead class="table-light">
						<tr>
							<th>Oluşturulma Tarihi</th>
							<th>Ad</th>
							<th>Soyad</th>
							<th>Telefon</th>
							<th>Email</th>
						</tr>
						<tr>
							<th></th>
							<th><input type="text" class="form-control form-control-sm" v-model="filters.ad"
									placeholder="Ad" /></th>
							<th><input type="text" class="form-control form-control-sm" v-model="filters.soyad"
									placeholder="Soyad" />
							</th>
							<th><input type="text" class="form-control form-control-sm" v-model="filters.telefon"
									placeholder="Telefon" /></th>
							<th><input type="text" class="form-control form-control-sm" v-model="filters.email"
									placeholder="Email" />
							</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(kullanici, index) in paginatedKullanicilar" :key="index">
							<td>{{ kullanici.tarih }}</td>
							<td>{{ kullanici.ad }}</td>
							<td>{{ kullanici.soyad }}</td>
							<td>{{ kullanici.telefon }}</td>
							<td>{{ kullanici.email }}</td>
							<td>
								<button class="btn btn-warning btn-sm me-2"></button>
								<button class="btn btn-danger btn-sm"></button>
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
	</div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

import { ref, computed } from 'vue'

const kullanicilar = ref([
	{ tarih: '01-11-2024 12:58:18', ad: 'Test', soyad: 'Test', telefon: '5321111111', email: 'test@test.com' },
])

const filters = ref({ ad: '', soyad: '', telefon: '', email: '' })

const perPage = ref(10)
const currentPage = ref(1)

const filteredKullanicilar = computed(() => {
	return kullanicilar.value.filter(k =>
		k.ad.toLowerCase().includes(filters.value.ad.toLowerCase()) &&
		k.soyad.toLowerCase().includes(filters.value.soyad.toLowerCase()) &&
		k.telefon.includes(filters.value.telefon) &&
		k.email.toLowerCase().includes(filters.value.email.toLowerCase())
	)
})

const totalPages = computed(() =>
	Math.ceil(filteredKullanicilar.value.length / perPage.value)
)

const paginatedKullanicilar = computed(() => {
	const start = (currentPage.value - 1) * perPage.value
	return filteredKullanicilar.value.slice(start, start + perPage.value)
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
</style>
