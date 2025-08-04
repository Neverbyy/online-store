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

// Получаем товары со скидками через getter (ограничиваем до 5)
const saleItems = computed(() => store.getters.getSaleItems.slice(0, 5));

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
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 24px;
      padding: 20px 0;
      min-width: auto;
      
      &-item {
        width: 100%;
        min-width: auto;
        
        .cart-action-btn {
          width: auto;
          margin-top: 10px;
        }
      }
    }
  }
  
  @media (max-width: 900px) and (min-width: 601px) {
    overflow: visible;
    
    .main__list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      padding: 16px 0;
      min-width: auto;
      
      &-item {
        width: 100%;
        min-width: auto;
        
        .cart-action-btn {
          width: auto;
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

@media (max-width: 600px) {
  .main-title {
    padding-left: 16px;
  }
  
  .mobile-scroll-container {
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
</style>