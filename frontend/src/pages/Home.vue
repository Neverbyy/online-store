<script setup>
  import TheMain from '../components/TheMain.vue'
  import { onMounted, computed } from 'vue'
  import { useMainStore, useCartStore } from '../store'
  import { useRoute } from 'vue-router'

const mainStore = useMainStore()
const cartStore = useCartStore()
const route = useRoute()
const products = computed(() => mainStore.getProducts)

onMounted(() => {
  mainStore.fetchProducts()
  mainStore.fetchItems()
  
  // Проверяем, если пользователь вернулся с оплаты
  if (route.query.payment === 'success') {
    // Очищаем корзину при успешном возврате с оплаты
    cartStore.clearCart()
  }
})

const props = defineProps({
  products: Array
})
</script>

<template>
    <TheMain :products="products"/>
</template>

<style lang="scss" scoped>

</style>