<script setup>
import ButtonCart from './UI/buttonCart.vue';
import { useStore } from 'vuex';
import { ref } from 'vue';

const props = defineProps({
  name: String,
  imageUrl: String,
  price: String,
  oldPrice: String,
  isExist: Boolean,
  isFavorite: Boolean,
  addToCart: Function
})

const store = useStore();
const showAddedMessage = ref(false);
const showMaxQuantityMessage = ref(false);

const handleAddToCart = () => {
  const cartItem = store.getters['cart/getCart'].find(item => item.name === props.name);
  if (cartItem && cartItem.quantity >= 20) {
    showMaxQuantityMessage.value = true;
    setTimeout(() => {
      showMaxQuantityMessage.value = false;
    }, 1500); // Показываем сообщение на 1.5 секунды
  } else {
    props.addToCart();
    showAddedMessage.value = true;
    setTimeout(() => {
      showAddedMessage.value = false;
    }, 1500); // Показываем сообщение на 1.5 секунды
  }
};

</script>

<template>

    <div class="main__list-item sale-item">
      <div :class="['added-to-cart', { show: showAddedMessage }]">Товар добавлен!</div>
      <div :class="['max-quantity', { show: showMaxQuantityMessage }]">Лимит достигнут!</div>
        <router-link to="#">
          <div class="main__list-item-inner sale-item">
            <img class="main__list-item-inner-image" :src="imageUrl" alt="1">
          </div>
        </router-link>
        <div class="main__list-item-inner-details">
            <span class="main__list-item-inner-name">{{name}}</span>
            <div class="main__list-item-inner-price-wrapper">
              <span class="main__list-item-inner-price"> {{ price }} ₽</span>
              <span class="main__list-item-inner-oldprice">{{ oldPrice }} ₽</span>
            </div>
        </div>
        <div class="main__list-item-inner-btns">
            <span> В наличии</span>
            <svg class="main__list-item-inner-like" width="32" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_518_90)">
              <rect x="19" y="19" width="40" height="40" rx="8" fill="#F6F6F6"/>
              <path d="M46.612 32.8261C46.1722 32.4057 45.65 32.0722 45.0752 31.8447C44.5005 31.6171 43.8844 31.5 43.2623 31.5C42.6401 31.5 42.0241 31.6171 41.4493 31.8447C40.8746 32.0722 40.3524 32.4057 39.9126 32.8261L38.9998 33.6982L38.087 32.8261C37.1986 31.9773 35.9936 31.5004 34.7372 31.5004C33.4809 31.5004 32.2759 31.9773 31.3875 32.8261C30.4991 33.6749 30 34.8262 30 36.0266C30 37.227 30.4991 38.3782 31.3875 39.227L32.3003 40.0991L38.9998 46.5L45.6992 40.0991L46.612 39.227C47.0521 38.8068 47.4011 38.3079 47.6393 37.7587C47.8774 37.2096 48 36.621 48 36.0266C48 35.4321 47.8774 34.8435 47.6393 34.2944C47.4011 33.7453 47.0521 33.2463 46.612 32.8261Z" stroke="#0C0C0C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
              <filter id="filter0_d_518_90" x="0" y="0" width="80" height="80" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dx="1" dy="1"/>
              <feGaussianBlur stdDeviation="10"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_518_90"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_518_90" result="shape"/>
              </filter>
              </defs>
            </svg>
        </div>
        <ButtonCart @click="handleAddToCart">В корзину</ButtonCart>
    </div>

</template>

<style lang="scss" scoped>
.added-to-cart, .max-quantity {
    opacity: 0;
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: #4caf50;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    transition: opacity 0.5s ease-in-out;
    z-index: 10;
}

.max-quantity {
  background-color: #df3939; /* Красный цвет для сообщения о максимальном количестве */
}

.added-to-cart.show, .max-quantity.show {
  opacity: 1;
}

.sale-item{
  position: relative;
}
.main__list-item-inner-price-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.main__list-item-inner-oldprice {
  font-size: 14px;
  color: #888;
  font-weight: 400;
  text-decoration: line-through;
}
</style>