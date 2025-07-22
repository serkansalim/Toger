<template>
    <nav>
        <ul class="pagination justify-content-center">
            <li class="page-item me-2" :class="{ disabled: modelValue === 1 }">
                <button class="btn btn-sm btn-secondary" @click="goToPage(modelValue - 1)">
                    <i class="fa fa-chevron-left"></i>
                </button>
            </li>

            <li v-for="p in visiblePages" :key="p" class="page-item"
                :class="{ disabled: p === '...' }">
                <button v-if="p !== '...'" class="btn btn-sm " :class="p === modelValue ? 'btn-dark':'btn-light'" @click="goToPage(p)">
                    {{ p }}
                </button>
                <span v-else class="btn btn-sm btn-light">…</span>
            </li>

            <li class="page-item ms-2" :class="{ disabled: modelValue === totalPages }">
                <button class="btn btn-sm btn-secondary" @click="goToPage(modelValue + 1)">
                    <i class="fa fa-chevron-right"></i>
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    modelValue: number
    total: number
    limit: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const totalPages = computed(() => Math.ceil(props.total / props.limit))

const visiblePages = computed(() => {
    const current = props.modelValue
    const max = totalPages.value
    const pages: (number | string)[] = []

    if (max <= 5) {
        for (let i = 1; i <= max; i++) pages.push(i)
    } else {
        if (current <= 3) {
            pages.push(1, 2, 3, '...', max)
        } else if (current >= max - 2) {
            pages.push(1, '...', max - 2, max - 1, max)
        } else {
            pages.push(1, '...', current, '...', max)
        }
    }

    return pages
})

function goToPage(p: number | string) {
    if (typeof p === 'number' && p >= 1 && p <= totalPages.value) {
        emit('update:modelValue', p)
    }
}
</script>