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

// Получаем товары со скидками через getter (ограничиваем до 6)
const saleItems = computed(() => store.getters.getSaleItems.slice(0, 6));

</script>

<template>

<Slider />

<div class="main container">
    <h1 class="main-title">Каталог</h1>
    
    <div class="mobile-scroll-container">
      <catalog :products="products"/>
    </div>

    <h1 class="main-title">Акции</h1>

    <div class="mobile-scroll-container">
      <SalesList :sales="saleItems"/>
    </div>
</div>

</template>


<style lang="scss" scoped>
.mobile-scroll-container {
  // Стили для десктопа (больше 900px)
  @media (min-width: 901px) {
    overflow: visible;
    
    .main__list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 0;
      min-width: auto;
      
      &-item {
        width: auto;
        min-width: auto;
        
        .cart-action-btn {
          width: auto;
          margin-top: 10px;
        }
      }
    }
  }
  
  @media (max-width: 900px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    .main__list {
      display: flex;
      flex-wrap: nowrap;
      gap: 16px;
      padding: 0 16px;
      min-width: max-content;
      
      &-item {
        width: 200px;
        min-width: 200px;
        
        .cart-action-btn {
          width: 100%;
          margin-top: 10px;
        }
      }
    }
  }
  
  @media (max-width: 600px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    .main__list {
      display: flex;
      flex-wrap: nowrap;
      gap: 16px;
      padding: 0 16px;
      min-width: max-content;
      
      &-item {
        width: 200px;
        min-width: 200px;
        
        .cart-action-btn {
          width: 100%;
          margin-top: 10px;
        }
      }
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