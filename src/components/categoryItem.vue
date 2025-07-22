<script setup>
import { ref, computed } from 'vue';
import CartActionButton from './UI/CartActionButton.vue';
import { useStore } from 'vuex';
import { transliterate } from '../helpers/translit';
import FavoriteIcon from './UI/FavoriteIcon.vue';

const props = defineProps({
  product: Object
});

const store = useStore();
const showAddedMessage = ref(false);
const showMaxQuantityMessage = ref(false);

// Вычисляем процент скидки
const discountPercentage = computed(() => {
  if (!props.product.oldPrice || !props.product.price || !props.product.isSale) return 0;
  
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
  <div class="category__main-item">
    <div class="category__main-details">
      <!-- Виджет скидки -->
      <div v-if="discountPercentage > 0" class="discount-widget">
        -{{ discountPercentage }}%
      </div>
      
      <router-link :to="`/catalog/${props.product.category}/${transliterate(props.product.name)}/${props.product.id}`">
        <img class="category__main-image" :src="props.product.image" alt="">
      </router-link>
      <div class="category__main-details-left">
        <router-link :to="`/catalog/${props.product.category}/${transliterate(props.product.name)}/${props.product.id}`">
          <h2>{{ props.product.name }}</h2>
        </router-link>
        <div class="category__main-details-left-features">
          <span v-for="(value, key) in Object.entries(product.features).slice(0, 3)" :key="key">
            {{ value[0] + ': ' + value[1] + ' '}}
          </span>
        </div>
        <h3>В наличии</h3>
      </div>
      <div class="category__main-details-right">
        <div :class="['added-to-cart', { show: showAddedMessage }]" >Товар добавлен!</div>
        <div :class="['max-quantity', { show: showMaxQuantityMessage }]">Лимит достигнут!</div>
        <div class="category__main-details-right-price-wrapper">
          <h2 class="category__main-details-right-price">{{ props.product.price }} Руб.</h2>
          <span v-if="props.product.oldPrice && props.product.isSale" class="category__main-details-right-oldprice">{{ props.product.oldPrice }} Руб.</span>
        </div>
        <div class="category__main-details-right-btns">
          <FavoriteIcon
            class="main__list-item-inner-like"
            :active="isFavorite"
            @click.stop="handleToggleFavorite"
          />
          <CartActionButton :product="product" :onAdded="handleShowAddedMessage" />
        </div>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>

.category__main-image{
  max-width: 200px;
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

.category__main-item {
  position: relative;
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
.category__main-details-left-features{
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.category__main-details-right-price-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.category__main-details-right-price{
  text-align: right;
  margin: 0;
}

.category__main-details-right-oldprice {
  font-size: 14px;
  color: #888;
  font-weight: 400;
  text-decoration: line-through;
}

.category__main-details-right{
  position: relative;
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-self: center;
}

.main__list-item-inner-like {
  cursor: pointer;
}

</style>