<script setup>
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import catalog from '../components/catalog.vue';

const store = useStore();
const products = computed(() => store.getters.getProducts);

onMounted(() => {
  store.dispatch('fetchProducts');
});

const props = defineProps({
  products: Array
})
</script>

<template>
    <div class="main container">
        <h1 class="main-title">Каталог товаров</h1>
        <div class="mobile-scroll-container">
          <catalog :products="products"/>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.mobile-scroll-container {

  
  @media (max-width: 900px) {
    overflow: visible;
    
    .main__list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding: 0 16px;
      place-items: center;
      
      &-item {
        width: 100%;
        min-width: auto;
        
        .cart-action-btn {
          width: 100%;
          margin-top: 10px;
        }
      }
    }
  }
  
  @media (max-width: 600px) {
    overflow: visible;
    
    .main__list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 0 12px;
      
      &-item {
        width: 100%;
        min-width: auto;
        
        .cart-action-btn {
          width: 100%;
          margin-top: 10px;
        }
      }
    }
  }
}

@media (max-width: 400px) {
  .mobile-scroll-container {
    .main__list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 0 12px;
      place-items: center;
    }
  }
}

@media (max-width: 900px) {
  .main-title {
    padding-left: 16px;
  }
  
  .main {
    padding-bottom: 80px;
  }
}
</style>