<script setup>
import CategoryItem from './categoryItem.vue';
import { useStore } from 'vuex';

const store = useStore();

const addToCart = (product) => {
  store.dispatch('cart/addToCart', product);
}

const props = defineProps({
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
.category__main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// Адаптивные стили для планшетов
@media (max-width: 900px) {
  .category__main {
    gap: 16px;
  }
}

// Адаптивные стили для мобильных устройств
@media (max-width: 600px) {
  .category__main {
    gap: 0;
    width: 100%;
    
    .category__main-item {
      width: 100%;
      margin-bottom: 16px;
    }
  }
}
</style>