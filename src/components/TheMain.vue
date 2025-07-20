<script setup>
import catalog from './catalog.vue';
import SalesList from './salesList.vue';
import Slider from './slider.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();

const props = defineProps({
  products: Array
})

// Получаем товары со скидками через getter
const saleItems = computed(() => store.getters.getSaleItems);

</script>

<template>

<Slider />

<div class="main container">
    <h1>Каталог</h1>
    
    <catalog :products="products"/>

    <h1>Акции</h1>

    <SalesList :sales="saleItems"/>
  </div>

</template>


<style lang="scss" scoped>

</style>