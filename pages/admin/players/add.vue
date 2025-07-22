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
import type { CreatePlayerDto } from '~/types/player/CreatePlayerDto'
import type { Team } from '~/types/team/Team'
import type { SportSchool } from '~/types/sportSchool/SportSchool'
import type { Parent } from '~/types/parent/Parent'
import { useToast } from '~/composables/useToast'
import { POSITIONS } from '~/utils/position'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const { getById, create } = usePlayerRepository()
const { getAll } = useTeamRepository()
const { getAllSportSchools } = useSportSchoolRepository()
const { getAllParents } = useParentRepository()

const form = ref<CreatePlayerDto>({
    name: null,
    surname: null,
    isActive: null,
    isFeeRequired: null,
    feePrice: null,
    uniqueId: null,
    birthDate: null,
    birthPlace: null,
    height: null,
    weight: null,
    nation: null,
    lisansNo: null,
    foot: null,
    isHomepage: null,
    position: null,
    photo: null,
    team: { id: null },
    sportSchool: { id: null },
    parent: { id: null },
})

const teams = ref<Team[]>([])
const sportSchools = ref<SportSchool[]>([])
const parents = ref<Parent[]>([])

let loading = ref(false)

onMounted(async () => {
    const teamsRes = await getAll({ page: 1, limit: 1000 }) // tüm takımları al
    teams.value = teamsRes.data

    const sportSchoolsRes = await getAllSportSchools({ page: 1, limit: 1000 }) // tüm spor okullarını al
    sportSchools.value = sportSchoolsRes.data

    const parentsRes = await getAllParents({ page: 1, limit: 1000 }) // tüm takımları al
    parents.value = parentsRes.data
})


const handleSubmit = async () => {
    loading.value = true;

    try {
        const result = await create(form.value);
        // Başarı kontrolü (eğer wrapper varsa)
        if (result.success === true) {
            showToast('✅ Oyuncu başarıyla eklendi!', 'success');
            router.push('/admin/players');
            loading.value = false;
            return;
        }
        showToast(result?.message || 'Bir hata oluştu', 'danger');
        loading.value = false;

    }
    catch (error: any) {
        console.error('Create Player Error:', error);

        // Axios hataları genellikle burada olur
        const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Bilinmeyen bir hata oluştu';

        showToast(`❌ ${message}`, 'danger');
    } finally {
        loading.value = false;
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
        <h2 class="mb-3">Oyuncu Ekle</h2>

        <form @submit.prevent="handleSubmit" class="row g-3">

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
                <input v-model="form.birthDate" type="date" class="form-control" required />
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
    </div>
</template>