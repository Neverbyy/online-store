<script setup>
import CategoryItem from './categoryItem.vue';
import { useStore } from 'vuex';

const store = useStore();

const addToCart = (product) => {
  store.dispatch('cart/addToCart', product);
}

defineProps({
  products: Array
})

</script>

<template>

  <div class="category__main">
    <CategoryItem 
    v-for="product in products"
      :key="product.id"
      :product="product"
      :addToCart="() => addToCart(product)"
    />
  </div>
      
</template>


<style lang="scss" scoped>

</style>