<template>
	<h1 class="text-2xl font-bold mb-4">Dashboard</h1>
	<p class="text-gray-600 mb-2">Dashboard > Beyaz Liste</p>
	<div class="table p-3 mb-0 rounded-bottom-0">
		<div class="d-flex align-items-center gap-3">
			<button class="btn btn-success">Yeni Ekle</button>
			<div class="d-flex align-items-center gap-2">
				<span>Beyaz Liste (0/50)</span>
				<span>/</span>
				<span>Abonelik Durumu: <span class="text-success fw-bold">Mevcut</span></span>
			</div>
		</div>
	</div>

	<div class="card rounded-top-0 p-3">
		<div class="mb-3">
			<label>
				Sayfada
				<select v-model="perPage" class="form-select d-inline-block w-auto ">
					<option :value="5">5</option>
					<option :value="10">10</option>
					<option :value="25">25</option>
				</select>
				kayıt göster
			</label>
		</div>

		<div class="table row g-0  ">
			<div class="col-md-2 border-end p-2">
				<label class="form-label small">Oluşturulma Tarihi</label>
			</div>
			<div class="col-md-2 border-end p-2">
				<label class="form-label small">Plaka</label>
				<input type="text" class="form-control form-control-sm" placeholder="AB123CD" />
			</div>
			<div class="col-md-2 border-end p-2">
				<label class="form-label small">Açıklama</label>
				<input type="text" class="form-control form-control-sm" placeholder="1234567890" />
			</div>
			<div class="col-md-2 border-end p-2">
				<label class="form-label small">Ödeme Durumu</label>
			</div>
			<div class="col-md-2 border-end p-2">
				<label class="form-label small">Bitiş Tarihi</label>
			</div>
			<div class="col-md-2 p-2">
				<label class="form-label small">Ara</label>
			</div>
			<div class="table text-center p-3 rounded-0">
				<h6>Tablodaki herhangi bir veri mevcut değil</h6>
			</div>
		</div>
		<nav class="d-flex justify-content-start">
			<ul class="pagination">
				<li class="page-item" :class="{ disabled: currentPage === 1 }">
					<button class="page-link" @click="goToPage(1)">İlk</button>
				</li>
				<li class="page-item" :class="{ disabled: currentPage === 1 }">
					<button class="page-link" @click="goToPage(currentPage - 1)">Önceki</button>
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

<script setup>
definePageMeta({ layout: 'admin' })

const perPage = ref(10)
const currentPage = ref(1)
</script>

<style>
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

select.form-select.d-inline-block.w-auto {
	min-width: 65px;
}

.table.text-center.p-3.rounded-0 {
	background-color: #ededed;
}
</style>
