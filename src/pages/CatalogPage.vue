<script setup>
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import catalog from '../components/catalog.vue';

const store = useStore();
const products = computed(() => store.getters.getProducts);

onMounted(() => {
  store.dispatch('fetchProducts');
});

defineProps({
  products: Array
})
</script>

<template>
    <div class="main container">
        <h1>Каталог товаров</h1>
        <catalog :products="products"/>
    </div>
</template>


<style lang="scss" scoped>

</style>