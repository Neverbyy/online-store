<script setup>
import { computed, watch, nextTick } from 'vue';
import { useStore } from 'vuex';

import ProfileSettings from '../components/ProfileSettings.vue';
import Orders from '../components/Orders.vue';
import Addresses from '../components/Addresses.vue';
import Reviews from '../components/Reviews.vue';

const store = useStore();

// Массив компонентов для отображения
const components = [
    ProfileSettings,
    Orders,
    Addresses,
    Reviews
];

// Вычисляемое свойство для получения текущего компонента из Vuex Store
const currentComponent = computed(() => {
    return components[store.state.profile.activeItem];
});

// Следим за изменением активного элемента и обновляем заказы при переходе на вкладку "Заказы"
watch(() => store.state.profile.activeItem, async (newIndex) => {
    if (newIndex === 1) { // Индекс 1 соответствует вкладке "Заказы"
        await nextTick();
        // Эмитим событие для обновления заказов
        window.dispatchEvent(new CustomEvent('refresh-orders'));
    }
});
</script>

<template>
    <component :is="currentComponent"></component>
</template>

<style lang="scss" scoped>
</style>