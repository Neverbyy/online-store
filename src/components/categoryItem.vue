<script setup>
import { ref } from 'vue';
import ButtonCart from './UI/buttonCart.vue';
import { useStore } from 'vuex';
import { transliterate } from '../helpers/translit';

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
    props.addToCart();
    showAddedMessage.value = true;
    setTimeout(() => {
      showAddedMessage.value = false;
    }, 1500);
  }
};
</script>

<template>
  <div class="category__main-item">
    <div class="category__main-details">
      <router-link :to="`/catalog/${props.product.category}/${transliterate(props.product.name)}/${props.product.id}`">
        <img class="category__main-image" :src="props.product.image" alt="">
      </router-link>
      <div class="category__main-details-left">
        <router-link :to="`/catalog/${props.product.category}/${transliterate(props.product.name)}/${props.product.id}`">
          <h2>{{ props.product.name }}</h2>
        </router-link>
        <span v-for="(value, key) in product.features" :key="key">
          {{ key + ' ' + value + ' '}}
        </span>
        <h3>В наличии</h3>
      </div>
      <div class="category__main-details-right">
        <div :class="['added-to-cart', { show: showAddedMessage }]" >Товар добавлен!</div>
        <div :class="['max-quantity', { show: showMaxQuantityMessage }]">Лимит достигнут!</div>
        <h2 class="category__main-details-right-price">{{ props.product.price }} Руб.</h2>
        <div class="category__main-details-right-btns">
          <svg class="main__list-item-inner-like" width="32" height="32" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="19" y="19" width="40" height="40" rx="8"/>
            <path d="M46.612 32.8261C46.1722 32.4057 45.65 32.0722 45.0752 31.8447C44.5005 31.6171 43.8844 31.5 43.2623 31.5C42.6401 31.5 42.0241 31.6171 41.4493 31.8447C40.8746 32.0722 40.3524 32.4057 39.9126 32.8261L38.9998 33.6982L38.087 32.8261C37.1986 31.9773 35.9936 31.5004 34.7372 31.5004C33.4809 31.5004 32.2759 31.9773 31.3875 32.8261C30.4991 33.6749 30 34.8262 30 36.0266C30 37.227 30.4991 38.3782 31.3875 39.227L32.3003 40.0991L38.9998 46.5L45.6992 40.0991L46.612 39.227C47.0521 38.8068 47.4011 38.3079 47.6393 37.7587C47.8774 37.2096 48 36.621 48 36.0266C48 35.4321 47.8774 34.8435 47.6393 34.2944C47.4011 33.7453 47.0521 33.2463 46.612 32.8261Z" stroke="#0C0C0C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <ButtonCart @click="handleAddToCart">В корзину</ButtonCart>
        </div>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.category__main-details-right{
  position: relative;
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-self: center;
}

.category__main-image{
  max-width: 200px;
}

// Стили для названий товаров
.category__main-details-left h2 {
  color: var(--color-black);
}

// Также добавим стили для ссылок, чтобы они не меняли цвет при наведении
.category__main-details-left a {
  color: var(--color-black);
  text-decoration: none;
  
  &:hover {
    color: var(--color-black);
  }
}

.category__main-details-right-price{
  text-align: right;
}


</style>