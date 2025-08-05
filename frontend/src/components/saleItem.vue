<script setup>
import ButtonCart from './UI/buttonCart.vue';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { transliterate } from '../helpers/translit';
import FavoriteIcon from './UI/FavoriteIcon.vue';
import CartActionButton from './UI/CartActionButton.vue';
import { getImageUrl } from '../utils/imageUtils.js';

const props = defineProps({
  product: Object
})

const store = useStore();
const showAddedMessage = ref(false);
const showMaxQuantityMessage = ref(false);

// Получаем правильный URL изображения
const correctImageUrl = getImageUrl(props.product?.image);

// Вычисляем процент скидки
const discountPercentage = computed(() => {
  if (!props.product.oldPrice || !props.product.price) return 0;
  
  const oldPrice = parseInt(props.product.oldPrice.replace(/\s/g, ''));
  const currentPrice = parseInt(props.product.price.replace(/\s/g, ''));
  
  if (oldPrice <= currentPrice) return 0;
  
  return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
});

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

    <div class="main__list-item sale-item">
      <div :class="['added-to-cart', { show: showAddedMessage }]">Товар добавлен!</div>
      <div :class="['max-quantity', { show: showMaxQuantityMessage }]">Лимит достигнут!</div>
      
      <!-- Виджет скидки -->
      <div v-if="discountPercentage > 0" class="discount-widget">
        -{{ discountPercentage }}%
      </div>
      
        <router-link :to="`/catalog/${product.category}/${transliterate(product.name)}/${product.id}`">
          <div class="main__list-item-inner sale-item">
            <img class="main__list-item-inner-image" :src="correctImageUrl" alt="1">
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
        <CartActionButton :product="product" :onAdded="handleShowAddedMessage" />
    </div>

</template>

<style lang="scss" scoped>
.added-to-cart, .max-quantity {
    opacity: 0;
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: #750DC5;
    color: white;
    padding: 14px 18px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 10;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(117, 13, 197, 0.3);
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
  top: 5px;
  right: 5px;
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

@media (max-width: 600px) {
  .main__list-item-inner-price-wrapper {
    gap: 5px;
  }

  .main__list-item-inner-image {
    max-height: 120px;
  }
}
</style>