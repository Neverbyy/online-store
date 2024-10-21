<script setup>
  import TheMain from '../components/TheMain.vue';
  import { onMounted, computed } from 'vue';
  import {useStore} from 'vuex';


const store = useStore();
const products = computed(() => store.getters.getLimitedProducts)
const sales = computed(() => store.getters.getSales)

onMounted(() => {
  store.dispatch('fetchProducts');
  store.dispatch('fetchSales');
});


const props = defineProps({
  products: Array,
  sales: Array
})
</script>

<template>
    <TheMain :products="products" :sales="sales"/>
</template>

<style lang="scss" scoped>

</style>