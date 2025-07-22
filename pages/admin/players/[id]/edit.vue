<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { usePlayerRepository } from '~/repositories/PlayerRepository'
import { useTeamRepository } from '~/repositories/TeamRepository'
import { useSportSchoolRepository } from '~/repositories/SportSchoolRepository'
import { useParentRepository } from '~/repositories/ParentRepository'
import type { UpdatePlayerDto } from '~/types/player/UpdatePlayerDto'
import type { Team } from '~/types/team/Team'
import type { SportSchool } from '~/types/sportSchool/SportSchool'
import type { Parent } from '~/types/parent/Parent'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const { getById, update, uploadPlayerPhoto } = usePlayerRepository()
const { getAll } = useTeamRepository()
const { getAllSportSchools } = useSportSchoolRepository()
const { getAllParents } = useParentRepository()


const id = Number(route.params.id)
const form = ref<UpdatePlayerDto>({
    name: null,
    surname: null,
    uniqueId: null,
    birthDate: null,
    birthPlace: null,
    weight: null,
    height: null,
    lisansNo: null,
    foot: null,
    position: null,
    photo: null,
    team: { id: null },
    sportSchool: { id: null },
    parent: { id: null },
})

const teams = ref<Team[]>([])
const sportSchools = ref<SportSchool[]>([])
const parents = ref<Parent[]>([])

const playerParent = ref<Parent>()

let loading = ref(false)
const showPhotoModal = ref(false)

onMounted(async () => {
    const player = await getById(id)
    form.value = {
        name: player.name,
        surname: player.surname,
        isActive: player.isActive,
        isFeeRequired: player.isFeeRequired,
        feePrice: player.feePrice,
        uniqueId: player.uniqueId,
        birthDate: player.birthDate?.slice(0, 10), // yyyy-MM-dd
        birthPlace: player.birthPlace,
        height: player.height,
        weight: player.weight,
        nation: player.nation,
        lisansNo: player.lisansNo,
        foot: player.foot,
        isHomepage: player.isHomepage,
        position: player.position,
        photo: player.photo,
        team: { id: player.team?.id ?? null },       // <-- güvenli kullanım
        sportSchool: { id: player.sportSchool?.id ?? null },       // <-- güvenli kullanım
        parent: { id: player.parent?.id ?? null }     // <-- güvenli kullanım
    }

    playerParent.value = player.parent;

    const teamsRes = await getAll({ page: 1, limit: 1000 }) // tüm takımları al
    teams.value = teamsRes.data

    const sportSchoolsRes = await getAllSportSchools({ page: 1, limit: 1000 }) // tüm spor okullarını al
    sportSchools.value = sportSchoolsRes.data

    const parentsRes = await getAllParents({ page: 1, limit: 1000 }) // tüm takımları al
    parents.value = parentsRes.data
})

const handleSubmit = async () => {
    try {
        loading.value = true;
        let result = await update(id, form.value)
        if(result.success) {
            loading.value = false;
            showToast('✅ Oyuncu başarıyla güncellendi!', 'success')
            router.push('/admin/players')
        }
        else {
            loading.value = false;
            showToast(result.message, 'danger')
        }
    }
    catch(err) {
        loading.value = false;
        let messages = err.response?.data?.message;
        for (let index = 0; index < messages.length; index++) {
            const message = messages[index];
            showToast(message, 'danger')
        }
    }
}


const uploadPhoto = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) {
        showToast('❌ Dosya seçilmedi.', 'danger')
        return
    }

    loading.value = true
    try {
        const res = await uploadPlayerPhoto(id, file)
        form.value["photo"] = res.location;
        showToast('✅ Resim başarıyla yüklendi!', 'success')
    } catch (error) {
        console.error(error)
        showToast('❌ Görsel yüklenirken hata oluştu.', 'danger')
    } finally {
        loading.value = false
    }
}

</script>

<template>
    <div class="container py-4">
        <div class="row mb-3">
            <div class="col-12">
                <NuxtLink :to="`/admin/players`">
                    <i class="fas fa-arrow-left me-2"></i>
                    Oyuncular
                </NuxtLink>
            </div>
        </div>
        <h2 class="mb-3">Oyuncu Düzenle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">

            <div class="mb-3">
                <label class="form-label">Profil Yükle</label>

                <div v-if="form.photo" class="mb-2 text-center">
                    <img :src="form.photo" alt="Oyuncu Fotoğraf" class="img-fluid rounded" style="max-height: 120px;"
                        @click="showPhotoModal = true" />
                </div>
                <input type="file" class="form-control" accept="image/png, image/jpeg" @change="uploadPhoto($event)" />
            </div>

            <div class="col-md-6">
                <label class="form-label">Ad</label>
                <input v-model="form.name" type="text" placeholder="oyuncu adı.." class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Soyad</label>
                <input v-model="form.surname" type="text" placeholder="oyuncu soyadı.." class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Oyuncu Aidatlı mı?</label>
                <select v-model="form.isFeeRequired" class="form-select">
                    <option :value="null">Seçiniz</option>
                    <option :value=true>Evet</option>
                    <option :value=false>Hayır</option>
                </select>
            </div>

            <div class="col-md-6" v-if="form.isFeeRequired == true">
                <label class="form-label">Aidat Tutarı</label>
                <input v-model="form.feePrice" type="number" placeholder="aidat tutarı.." class="form-control" />
            </div>

            <div class="col-md-6">
                <label class="form-label">Tc Kimlik</label>
                <input v-model="form.uniqueId" type="text" placeholder="tc kimlik.." class="form-control" required />
            </div>

            <div class="col-md-4">
                <label class="form-label">Lisans No</label>
                <input v-model="form.lisansNo" type="text" placeholder="lisans no.." class="form-control" />
            </div>

            <div class="col-md-4">
                <label class="form-label">Doğum Tarihi</label>
                <input v-model="form.birthDate" type="date" class="form-control" required/>
            </div>

            <div class="col-md-4">
                <label class="form-label">Doğum Yeri</label>
                <input v-model="form.birthPlace" type="text" class="form-control" placeholder="örn: Göztepe"/>
            </div>

            <div class="col-md-4">
                <label class="form-label">Uyruk</label>
                <input v-model="form.nation" type="text" placeholder="örn: Turkey" class="form-control" />
            </div>

            <div class="col-md-4">
                <label class="form-label">Mevki</label>
                <select v-model="form.position" class="form-select">
                    <option :value="null">Mevki seçiniz</option>
                    <option v-for="pos in POSITIONS" :key="pos.value" :value="pos.value">
                        {{ pos.label }}
                    </option>
                </select>
            </div>



            <div class="col-12">
                <div class="row">
                    <div class="col-md-4">
                        <label class="form-label">Ayak</label>
                        <select v-model="form.foot" class="form-select">
                            <option :value="null">Seçiniz</option>
                            <option value="Right">Sağ</option>
                            <option value="Left">Sol</option>
                            <option value="Both">İkiside</option>
                        </select>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Boy</label>
                        <input v-model="form.height" type="text" placeholder="örn: 1.80" class="form-control" />
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Kilo</label>
                        <input v-model="form.weight" type="text" placeholder="örn: 60" class="form-control" />
                    </div>
                </div>
            </div>


            <div class="col-md-4">
                <label class="form-label">Anasayfa Görünürlük</label>
                <select v-model="form.isHomepage" class="form-select">
                    <option :value="true">Evet</option>
                    <option :value="false">Hayır</option>
                </select>
            </div>

            <div class="col-md-4">
                <label class="form-label">Takım Seç</label>
                <select v-model.number="form.team.id" class="form-select">
                    <option :value="null">Takım seçin...</option>
                    <option v-for="team in teams" :key="team.id" :value="team.id">
                        {{ team.name }} ({{ team.ageGroup }})
                    </option>
                </select>
            </div>

            <div class="col-md-4">
                <label class="form-label">Spor Okulu Seç</label>
                <select v-model.number="form.sportSchool.id" class="form-select">
                    <option :value="null">Spor okulu seçin...</option>
                    <option v-for="sportSchool in sportSchools" :key="sportSchool.id" :value="sportSchool.id">
                        {{ sportSchool.name }} ({{ sportSchool.ageGroup }})
                    </option>
                </select>
            </div>

            <div class="col-md-4">
                <label class="form-label">Veli Seç</label>
                <select v-model.number="form.parent.id" class="form-select">
                    <option disabled value="0">Veli seçin...</option>
                    <option v-for="parent in parents" :key="parent.id" :value="parent.id">
                        {{ parent.name }}
                    </option>
                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label">Durum</label>
                <select v-model="form.isActive" class="form-select">
                    <option :value="true">Aktif</option>
                    <option :value="false">Pasif</option>
                </select>
            </div>

            <div class="col-md-12">
                <button type="submit" :disabled="loading" class="btn btn-primary">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                        aria-hidden="true"></span>
                    Güncelle
                </button>
            </div>
        </form>


        <div class="col-12 mt-5">
            <h5>Oyuncu Velisi</h5>

            <div v-if="playerParent">
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{{ playerParent.name }} {{ playerParent.surname }}</strong>
                            <br />
                            <small class="text-muted">Tc Kimlik: {{ playerParent.uniqueId || 'Bilinmiyor' }}</small>
                            <br />
                            <small class="text-muted">Telefon: {{ playerParent.phone || 'Bilinmiyor' }}</small>
                            <br />
                            <small class="text-muted">E-mail: {{ playerParent.email || 'Bilinmiyor' }}</small>
                        </div>
                        <NuxtLink :to="`/admin/parent/${playerParent.id}/edit`" class="btn btn-sm btn-outline-primary">
                            Detay
                        </NuxtLink>
                    </li>
                </ul>
            </div>

            <p v-else class="text-muted">Bu oyuncuya ait veli bulunamadı.</p>
        </div>

        <div v-if="showPhotoModal" class="photo-modal" @click.self="showPhotoModal = false">
            <div class="photo-modal-content">
                <button class="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                    @click="showPhotoModal = false"></button>
                <img :src="form.photo" alt="Oyuncu Fotoğraf" />
            </div>
        </div>
    </div>
</template>

<style>
.photo-modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
}

.photo-modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
}

.photo-modal-content img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}
</style>