<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import ProfileSettings from '../components/ProfileSettings.vue';
import Orders from '../components/Orders.vue';
import Addresses from '../components/Addresses.vue';
import Feedback from '../components/Feedback.vue';

const store = useStore();

// Массив компонентов для отображения
const components = [
    ProfileSettings,
    Orders,
    Addresses,
    Feedback
];

// Вычисляемое свойство для получения текущего компонента из Vuex Store
const currentComponent = computed(() => {
    return components[store.state.profile.activeItem];
});
</script>

<template>
    <component :is="currentComponent"></component>
</template>

<style lang="scss" scoped>
</style>