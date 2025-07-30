<script setup>
import { defineProps, ref, computed } from 'vue';
import CartActionButton from './UI/CartActionButton.vue';
import { useStore } from 'vuex';
import FavoriteIcon from './UI/FavoriteIcon.vue';
import { getImageUrl } from '../utils/imageUtils.js';

const props = defineProps({
  product: Object
});

const store = useStore();
const showAddedMessage = ref(false);
const showMaxQuantityMessage = ref(false);

// Получаем правильный URL изображения
const correctImageUrl = getImageUrl(props.product?.image);

// Удаляю addToCart из props и handleAddToCart

const isFavorite = computed(() => store.getters['favorite/isFavorite'](props.product.id));
const handleToggleFavorite = async () => {
  if (isFavorite.value) {
    await store.dispatch('favorite/removeFromFavorites', props.product.id);
  } else {
    await store.dispatch('favorite/addToFavorites', props.product);
  }
};

const handleShowAddedMessage = () => {
  showAddedMessage.value = true;
  setTimeout(() => {
    showAddedMessage.value = false;
  }, 1500);
};
</script>
<template>
    <div class="main container">
      <div class="product-card">
        <div class="product-card__inner">
          <img class="product-card-image" :src="correctImageUrl" :alt="product.name">
          <div class="product-card-details">
            <h1>Характеристики:</h1>
            <div class="product-card-details-inner"
            v-for="(value, key) in product.features" :key="key">
            <div class="one">{{ key }}</div>
            <div class="two">{{ value }}</div>
            </div>
          </div>
          <div class="product-card-buy">
            <div :class="['added-to-cart', { show: showAddedMessage }]">Товар добавлен!</div>
            <div :class="['max-quantity', { show: showMaxQuantityMessage }]">Лимит достигнут!</div>
            <div class="product-card-price"><h2> {{ product.price }} ₽</h2></div>
            <div class="product-card-buy-row">
              <FavoriteIcon :active="isFavorite" @click="handleToggleFavorite" width="40" height="40" style="cursor:pointer;"/>
              <div class="product-card-btn"><CartActionButton :product="product" :onAdded="handleShowAddedMessage" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<style lang="scss" scoped>
.product-card__inner{
  display: flex;
  justify-content: space-between;
  position: relative;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 20px;
  }
}
.product-card-buy {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  @media (max-width: 600px) {
    padding: 0 16px;
    margin-top: 20px;
  }
}
.product-card-buy-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  
  @media (max-width: 600px) {
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    padding: 0 16px;
  }
}
.product-card{
  border-radius: 8px;
  
  @media (max-width: 600px) {
    border-radius: 8px;
  }

  &-image{
    width: 350px;
    
    @media (max-width: 600px) {
      width: 80%;
      max-width: 300px;
      height: auto;
      border-radius: 8px;
      margin: 0 auto;
      display: block;
    }
  }

  &-buy{
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
  }
  &-details{
    font-weight: 300;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    
    @media (max-width: 600px) {
      row-gap: 16px;
      padding: 0 16px;
    }
    
    &-inner{
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 16px;
      
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
        grid-gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
      }
    }
  }
}

.one{
  border-bottom: 1px dotted #595555;
}
</style>