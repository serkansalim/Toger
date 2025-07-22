<template>
  <div class="card p-3">
    <h4 class="text-2xl font-bold mb-0">Dashboard</h4>
    <p class="text-gray-600 mb-4">Dashboard > HGS Onay</p>

    <h4 class="mb-3">Vaditepe Gölevleri #241383</h4>

    <div class="row g-2 mb-3">
      <div class="col-12 col-md-3"><strong>Başlangıç saati:</strong> <span class="text-muted">2024-11-07 20:36:46</span>
      </div>
      <div class="col-12 col-md-3"><strong>Bitiş saati:</strong> <span class="text-muted">2024-11-08 09:13:17</span>
      </div>
      <div class="col-12 col-md-3"><strong>Süre:</strong> <span class="text-muted">12:36:31</span></div>
      <div class="col-12 col-md-3"><strong>Maliyet:</strong> <span class="text-muted">112</span></div>
    </div>

    <h2 class="plate text-center mb-3">34GFC510</h2>

    <div class="images d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center mb-4">
      <img src="https://www.estart.com.tr/image/cache/catalog/estart-blog/images-600x315w.jpeg" alt="Aracın arkası" />
      <img src="https://www.cozumarge.com.tr/wp-content/uploads/2023/09/plaka-tanima-sistemi-3.png" alt="Geniş açı" />
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUgZrXZYO8j8cyEVXiMF1twPRSPeHpThjn0g&s"
        alt="Plaka" class="small-img" />
    </div>

    <div class="d-flex flex-column flex-md-row justify-content-center gap-2 mb-4">
      <button class="btn w-100 w-md-auto" style="background-color: #31B94D; color: #fff;">✔ ONAYLA</button>
      <button class="btn w-100 w-md-auto" style="background-color: #FA0009; color: #fff;">❌ REDDET</button>
    </div>


      <div class="info-list d-flex flex-column gap-2 mt-3 pt-2">
        <div class="d-flex gap-2">
          <strong class="w-50">Başlangıç Saati:</strong>
          <span class="text-muted">2024-11-07 21:36:46</span>
        </div>
        <div class="d-flex gap-2">
          <strong class="w-50">Bitiş Saati:</strong>
          <span class="text-muted">2024-11-08 09:13:17</span>
        </div>
        <div class="d-flex gap-2">
          <strong class="w-50">Süre:</strong>
          <span class="text-muted">697</span>
        </div>
        <div class="d-flex gap-2">
          <strong class="w-50">Maliyet:</strong>
          <span class="text-muted">112</span>
        </div>
        <div class="d-flex gap-2">
          <strong class="w-50">Durum:</strong>
          <span class="text-muted">Normal</span>
        </div>
      </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
.plate {
  font-size: 24px;
}

.images img {
  width: 100%;
  max-width: 250px;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.small-img {
  width: 100px !important;
  height: 60px !important;
  margin-top: auto;
}

.info-list {
  font-size: 15px;
}

@media (max-width: 767px) {
  .row>div {
    text-align: left !important;
  }
}
</style>
