<script setup>
import { defineProps, ref, computed } from 'vue';
import CartActionButton from './UI/CartActionButton.vue';
import { useStore } from 'vuex';
import FavoriteIcon from './UI/FavoriteIcon.vue';

const props = defineProps({
  product: Object
});

const store = useStore();
const showAddedMessage = ref(false);
const showMaxQuantityMessage = ref(false);

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
          <img class="product-card-image" :src="product.image" :alt="product.name">
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
}
.product-card-buy {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.product-card-buy-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}
.product-card{
  border-radius: 8px;

  &-image{
    width: 350px;
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
    &-inner{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  }
  }
}

.one{
  border-bottom: 1px dotted #595555;
}
</style>