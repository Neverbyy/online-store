<script setup>
  import TheMain from '../components/TheMain.vue';
  import { onMounted, computed } from 'vue';
  import {useStore} from 'vuex';
  import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();
const products = computed(() => store.getters.getLimitedProducts)

onMounted(() => {
  store.dispatch('fetchProducts');
  store.dispatch('fetchItems');
  
  // Проверяем, если пользователь вернулся с оплаты
  if (route.query.payment === 'success') {
    // Очищаем корзину при успешном возврате с оплаты
    store.dispatch('cart/clearCart');
  }
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