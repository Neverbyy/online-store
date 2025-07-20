<script setup>
  import TheMain from '../components/TheMain.vue';
  import { onMounted, computed } from 'vue';
  import {useStore} from 'vuex';


const store = useStore();
const products = computed(() => store.getters.getLimitedProducts)

onMounted(() => {
  store.dispatch('fetchProducts');
  store.dispatch('fetchItems');
});


const props = defineProps({
  products: Array
})
</script>

<template>
    <TheMain :products="products"/>
</template>

<style lang="scss" scoped>

</style>