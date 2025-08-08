<script setup>
import { computed, watch, nextTick } from 'vue'
import { useProfileStore } from '../store'

import ProfileSettings from '../components/ProfileSettings.vue'
import Orders from '../components/Orders.vue'
import Addresses from '../components/Addresses.vue'
import Reviews from '../components/Reviews.vue'

const profileStore = useProfileStore()

// Массив компонентов для отображения
const components = [
    ProfileSettings,
    Orders,
    Addresses,
    Reviews
]

// Вычисляемое свойство для получения текущего компонента из Pinia Store
const currentComponent = computed(() => {
    return components[profileStore.getActiveItem]
})

// Следим за изменением активного элемента и обновляем заказы при переходе на вкладку "Заказы"
watch(() => profileStore.getActiveItem, async (newIndex) => {
    if (newIndex === 1) { // Индекс 1 соответствует вкладке "Заказы"
        await nextTick()
        // Эмитим событие для обновления заказов
        window.dispatchEvent(new CustomEvent('refresh-orders'))
    }
})
</script>

<template>
    <component :is="currentComponent"></component>
</template>

<style lang="scss" scoped>
</style>