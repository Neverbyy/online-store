<script setup>
import { defineProps, ref } from 'vue';
import buttonCart from './UI/buttonCart.vue';
import { useStore } from 'vuex';

const props = defineProps({
  product: Object,
  addToCart: Function
});

const store = useStore();
const showAddedMessage = ref(false);
const showMaxQuantityMessage = ref(false);

const handleAddToCart = () => {
  const cartItem = store.getters['cart/getCart'].find(item => item.name === props.product.name);
  if (cartItem && cartItem.quantity >= 20) {
    showMaxQuantityMessage.value = true;
    setTimeout(() => {
      showMaxQuantityMessage.value = false;
    }, 1500);
  } else {
    props.addToCart(props.product); // Передаем выбранный продукт в функцию addToCart
    showAddedMessage.value = true;
    setTimeout(() => {
      showAddedMessage.value = false;
    }, 1500);
  }
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
            <div class="product-card-btn"><buttonCart @click="handleAddToCart">В корзину</buttonCart></div>
          </div>
        </div>
      </div>
    </div>
  </template>

<style lang="scss" scoped>
.product-card__inner{
  display: flex;
  justify-content: space-between;
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