<script setup>
import catalog from './catalog.vue';
import SalesList from './salesList.vue';
import Slider from './slider.vue';

defineProps({
  products: Array,
  sales: Array
})


</script>

<template>

<Slider />

<div class="main container">
    <h1>Каталог</h1>
    
    <catalog :products="products"/>

    <h1>Акции</h1>

    <SalesList :sales="sales"/>
  </div>

</template>


<style lang="scss" scoped>

</style>