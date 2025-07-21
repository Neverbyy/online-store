<script setup>
import ButtonCart from './UI/buttonCart.vue';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { transliterate } from '../helpers/translit';
import FavoriteIcon from './UI/FavoriteIcon.vue';

const props = defineProps({
  product: Object,
  addToCart: Function
})

const store = useStore();
const showAddedMessage = ref(false);
const showMaxQuantityMessage = ref(false);

// Вычисляем процент скидки
const discountPercentage = computed(() => {
  if (!props.product.oldPrice || !props.product.price) return 0;
  
  const oldPrice = parseInt(props.product.oldPrice.replace(/\s/g, ''));
  const currentPrice = parseInt(props.product.price.replace(/\s/g, ''));
  
  if (oldPrice <= currentPrice) return 0;
  
  return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
});

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

const isFavorite = computed(() => store.getters['favorite/isFavorite'](props.product.id));
const handleToggleFavorite = async () => {
  if (isFavorite.value) {
    await store.dispatch('favorite/removeFromFavorites', props.product.id);
  } else {
    await store.dispatch('favorite/addToFavorites', props.product);
  }
};

</script>

<template>

    <div class="main__list-item sale-item">
      <div :class="['added-to-cart', { show: showAddedMessage }]">Товар добавлен!</div>
      <div :class="['max-quantity', { show: showMaxQuantityMessage }]">Лимит достигнут!</div>
      
      <!-- Виджет скидки -->
      <div v-if="discountPercentage > 0" class="discount-widget">
        -{{ discountPercentage }}%
      </div>
      
        <router-link :to="`/catalog/${product.category}/${transliterate(product.name)}/${product.id}`">
          <div class="main__list-item-inner sale-item">
            <img class="main__list-item-inner-image" :src="product.image" alt="1">
          </div>
        </router-link>
        <div class="main__list-item-inner-details">
            <router-link :to="`/catalog/${product.category}/${transliterate(product.name)}/${product.id}`">
              <span class="main__list-item-inner-name">{{product.name}}</span>
            </router-link>
            <div class="main__list-item-inner-price-wrapper">
              <span class="main__list-item-inner-price"> {{ product.price }} ₽</span>
              <span v-if="product.oldPrice" class="main__list-item-inner-oldprice">{{ product.oldPrice }} ₽</span>
            </div>
        </div>
        <div class="main__list-item-inner-btns">
            <span> В наличии</span>
            <FavoriteIcon
              class="main__list-item-inner-like"
              :active="isFavorite"
              @click.stop="handleToggleFavorite"
            />
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
  background-color: #df3939;
}

.added-to-cart.show, .max-quantity.show {
  opacity: 1;
}

.sale-item{
  position: relative;
}

// Виджет скидки
.discount-widget {
  position: absolute;
  top: 45px;
  right: 25px;
  background-color: #FFD700;
  color: #000;
  font-weight: bold;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.main__list-item-inner-name {
  color: var(--color-black);
  text-decoration: none;
  
  &:hover {
    color: var(--color-black);
  }
}
.main__list-item-inner-like {
  cursor: pointer;
}

.main__list-item-inner-image {
  max-width: 100%;
  max-height: 180px;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}
</style>