<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useTrainingRepository } from '~/repositories/TrainingRepository'
import { useAttendanceRepository } from '~/repositories/AttendanceRepository'
import type { CreateAttendanceDto, CreateOneAttendanceDto } from '~/types/training/CreateAttendanceDto'
import type { Player } from '~/types/player/Player'
import type { Attendance } from '~/types/training/Attendance'


const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

const { getById } = useTrainingRepository()

const trainingId = Number(route.params.id)
const players = ref<Player[]>([])
const attendances = ref<Attendance[]>([])
const loading = ref(false)
const loadingPlayers = ref(false)

const attendance = ref<CreateAttendanceDto>({
    present: [],
    absent: [],
    excused: []
})

onMounted(async () => {
    getTraining();
})

const getTraining = async () => {
    loadingPlayers.value = true;
    const res = await getById(trainingId)
    // İkili olasılığa göre kontrol
    if (res?.team?.players)
        players.value = res.team.players

    if (res?.attendance)
        attendances.value = res.attendance

    loadingPlayers.value = false;
}

const toggleStatus = (playerId: number, status: 'present' | 'absent' | 'excused') => {
    // Tüm statülerden oyuncuyu çıkar
    ['present', 'absent', 'excused'].forEach(key => {
        const arr = attendance.value[key as keyof CreateAttendanceDto] as number[]
        const index = arr.indexOf(playerId)
        if (index !== -1) arr.splice(index, 1)
    })

    // Yeni statüye ekle
    attendance.value[status]?.push(playerId)
}


const saveAttendance = async () => {
    loading.value = true
    try {
        const { save } = useAttendanceRepository()
        const result = await save(trainingId, attendance.value)


        if (result.success) {
            showToast('✅ Yoklama kaydedildi!', 'success')
            router.push('/admin/trainings')
        } else {
            showToast('❌ Hata oluştu', 'danger')
        }
    } catch (err) {
        console.error(err)
        showToast('❌ Bir hata oluştu', 'danger')
    } finally {
        loading.value = false
    }
}

const saveOneAttendance = async (dto: CreateOneAttendanceDto) => {
    loading.value = true
    try {
        const { saveOne } = useAttendanceRepository()
        const result = await saveOne(trainingId, dto)

        if (result.success) {
            showToast('✅ Yoklama kaydedildi!', 'success')
            getTraining();
        } else {
            showToast('❌ Hata oluştu', 'danger')
        }
    } catch (err) {
        console.error(err)
        showToast('❌ Bir hata oluştu', 'danger')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="container py-4">
        <NuxtLink :to="`/admin/trainings`">
            <i class="fas fa-arrow-left me-2"></i> Geri Dön
        </NuxtLink>

        <h2 class="mb-4 mt-3">Yoklama Al</h2>

        <div v-if="loadingPlayers">Oyuncular yükleniyor...</div>
        <table v-else class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Oyuncu</th>
                    <th>Durum</th>
                    <th class="text-center">Katıldı</th>
                    <th class="text-center">Mazeretli</th>
                    <th class="text-center">Gelmedi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="player in players" :key="player.id">
                    <td>{{ player.name }} {{ player.surname }}</td>
                    <td>
                        <span class="alert alert-sm alert-success px-2 py-1"
                            v-if="player.attendanceStatus == 'present'">
                            Mevcut
                        </span>
                        <span class="alert alert-sm alert-warning px-2 py-1"
                            v-if="player.attendanceStatus == 'excused'">
                            Mazeretli
                        </span>
                        <span class="alert alert-sm alert-danger px-2 py-1" v-if="player.attendanceStatus == 'absent'">
                            Yok
                        </span>
                    </td>

                    <td class="text-center">
                        <div class="form-check form-check-inline">
                            <button type="button" class="btn btn-sm btn-success"
                                @click="saveOneAttendance({ playerId: player.id, status: 'present' })">
                                Mevcut
                            </button>
                            <!-- <input class="form-check-input" type="radio" :id="`present-${player.id}`"
                                :name="`status-${player.id}`" value="present"
                                @change="toggleStatus(player.id, 'present')"
                                :checked="player.attendanceStatus == 'present'" /> -->
                        </div>
                    </td>

                    <td class="text-center">
                        <div class="form-check form-check-inline">
                            <button type="button" class="btn btn-sm btn-warning"
                                @click="saveOneAttendance({ playerId: player.id, status: 'excused' })">
                                Mazeretli
                            </button>
                            <!-- <input class="form-check-input" type="radio" :id="`excused-${player.id}`"
                                :name="`status-${player.id}`" value="excused"
                                @change="toggleStatus(player.id, 'excused')"
                                :checked="player.attendanceStatus == 'excused'" /> -->
                        </div>
                    </td>

                    <td class="text-center">
                        <div class="form-check form-check-inline">
                            <button type="button" class="btn btn-sm btn-danger"
                                @click="saveOneAttendance({ playerId: player.id, status: 'absent' })">
                                Gelmedi
                            </button>
                            <!-- <input class="form-check-input" type="radio" :id="`absent-${player.id}`"
                                :name="`status-${player.id}`" value="absent" @change="toggleStatus(player.id, 'absent')"
                                :checked="player.attendanceStatus == 'absent'" /> -->
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>


        <!-- <button class="btn btn-primary" @click="saveAttendance" :disabled="loading">
            Yoklamayı Kaydet
        </button> -->
    </div>
</template>
