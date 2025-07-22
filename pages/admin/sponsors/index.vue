<template>
  <div class="card">
    <h4 class="text-2xl font-bold mb-0">Dashboard</h4>
    <p class="text-gray-600 mb-4">Dashboard > HGS Onay</p>
    <h4>Vaditepe Gölevleri #241383</h4>
    <div class="d-flex align-items-center gap-2">
      <h6 class="mb-0">Başlangıç saati:</h6>
      <span class="text-gray-500">2024-11-07 20:36:46</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <h6 class="mb-0">Bitiş saati:</h6>
      <span class="text-gray-500">2024-11-08 09:13:17</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <h6 class="mb-0">Süre :</h6>
      <span class="text-gray-500">12:36:31</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <h6 class="mb-0">Maaliyet:</h6>
      <span class="text-gray-500">112</span>
    </div>
    <h2 class="plate">34GFC510</h2>
    <div class="images">
      <img src="https://www.estart.com.tr/image/cache/catalog/estart-blog/images-600x315w.jpeg" alt="Aracın arkası" />
      <img src="https://www.cozumarge.com.tr/wp-content/uploads/2023/09/plaka-tanima-sistemi-3.png" alt="Geniş açı" />
      <div class="image">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUgZrXZYO8j8cyEVXiMF1twPRSPeHpThjn0g&s"
          alt="Plaka" />
      </div>
    </div>

    <div class="d-flex justify-content mt-3 mb-4">
      <button class="btn w-100 me-2" style="background-color: #31B94D; color: #ffffff;">✔ ONAYLA</button>
      <button class="btn w-100 ms-2" style="background-color: #FA0009; color: #ffffff;">❌ REDDET</button>
    </div>
    <div class="table row g-0  ">
      <div class="col-md-3 p-2">
        <label class="form-label small">Başlangıç Saati</label>
      </div>
      <div class="col-md-3 p-2">
        <label class="form-label small">Bitiş Saati</label>
      </div>
      <div class="col-md-2 p-2">
        <label class="form-label small">Süre</label>
      </div>
      <div class="col-md-2 p-2">
        <label class="form-label small">Maaliyet</label>
      </div>
      <div class="col-md-2 p-2">
        <label class="form-label small">Durum</label>
      </div>
      <div class="table row g-0"></div>
      <div class="col-md-3 p-2">
        <label class="small">2024-11-07 20:36:46</label>
      </div>
      <div class="col-md-3 p-2">
        <label class="small">2024-11-07 21:36:46</label>
      </div>
      <div class="col-md-2 p-2">
        <label class="small">60</label>
      </div>

      <div class="col-md-2 p-2">
        <label class="small">0</label>
      </div>
      <div class="col-md-2 p-2">
        <label class="small">Ücretsiz</label>
      </div>
      <div class="col-md-3 p-2">
        <label class="small">2024-11-07 21:36:46</label>
      </div>
      <div class="col-md-3 p-2">
        <label class="small">2024-11-07 09:13:17</label>
      </div>
      <div class="col-md-2 p-2">
        <label class="small">697</label>
      </div>

      <div class="col-md-2 p-2">
        <label class="small">112</label>
      </div>
      <div class="col-md-2 p-2">
        <label class="small">Normal</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plate {
  font-size: 20px;
  margin-bottom: 10px;
}

h2.plate {
  text-align: center;
}

.images {
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
  align-items: center;
}

.images img {
  width: 400px;
  height: 200px;
  object-fit: cover;
  border-radius: 1px;
  border: 1px solid #ccc;
}

.image img {
  width: 100px;
  height: 60px;
  border: 1px solid #ccc;
  border-radius: 2px;
  margin-top: -100%;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>

<script setup>
definePageMeta({
  layout: 'admin'
})
</script>
