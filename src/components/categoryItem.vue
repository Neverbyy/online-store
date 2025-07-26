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
          <div class="in-stock-label">В наличии</div>
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
  top: 40px;
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

.in-stock-label {
  display: none; // Скрываем на десктопе
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

// Адаптивные стили для планшетов
@media (max-width: 900px) {
  .category__main-image {
    max-width: 180px;
  }
  
  .category__main-details-left h2 {
    font-size: 18px;
    line-height: 1.3;
  }
  
  .category__main-details-left-features {
    font-size: 14px;
  }
  
  .category__main-details-right-price {
    font-size: 18px;
  }
  
  .category__main-details-right-oldprice {
    font-size: 13px;
  }
}

// Адаптивные стили для мобильных устройств
@media (max-width: 600px) {
  .category__main-item {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }
  }
  
  .category__main-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  // Верхняя секция: изображение + детали
  .category__main-details {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  
  .category__main-image {
    max-width: 160px;
    height: 160px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .category__main-details-left {
    flex: 1;
    min-width: 0;
    
    h2 {
      font-size: 20px;
      line-height: 1.4;
      margin: 0 0 16px 0;
      font-weight: 700;
      color: #333;
      letter-spacing: -0.02em;
    }
    
    h3 {
      display: none; // Скрываем "В наличии" в верхней секции
    }
  }
  
  .category__main-details-left-features {
    font-size: 15px;
    color: #666;
    gap: 8px;
    line-height: 1.5;
    
    span {
      line-height: 1.5;
      display: block;
      margin-bottom: 4px;
    }
  }
  
  // Нижняя секция: цена + кнопки
  .category__main-details-right {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
    flex-direction: row;
    align-self: stretch;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    margin-left: 0;
  }
  
  .category__main-details-right-price-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .in-stock-label {
    font-size: 16px;
    color: #4CAF50;
    font-weight: 600;
    margin-bottom: 4px;
    display: block; // Показываем на мобильных
  }
  
  .category__main-details-right-price {
    font-size: 26px;
    color: #333;
    font-weight: 700;
    margin: 0;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  
  .category__main-details-right-oldprice {
    font-size: 15px;
    color: #999;
    font-weight: 500;
    text-decoration: line-through;
  }
  
  .category__main-details-right-btns {
    display: flex;
    gap: 16px;
    align-items: center;
    width: auto;
    justify-content: flex-end;
  }
  
  // Увеличиваем размеры кнопок
  :deep(.main__list-item-inner-like) {
    width: 48px;
    height: 48px;
    min-width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 12px;
    border: 2px solid #e8e8e8;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    &:hover {
      background-color: #f8f8f8;
      border-color: #750DC5;
      transform: scale(1.05);
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    svg {
      width: 22px;
      height: 22px;
    }
  }
  
  :deep(.cart-action-button) {
    padding: 14px 24px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    max-width: 180px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(117, 13, 197, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(117, 13, 197, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  // Виджет скидки для мобильных
  .discount-widget {
    top: 20px;
    right: 20px;
    font-size: 16px;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 800;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
    border: 2px solid #fff;
  }
  
  // Сообщения о добавлении в корзину
  .added-to-cart,
  .max-quantity {
    position: absolute;
    top: -60px;
    right: 0;
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
    
    &.show {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .max-quantity {
    background-color: #f44336;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.3);
  }
}

// Дополнительные стили для очень маленьких экранов
@media (max-width: 480px) {
  .category__main-item {
    padding: 20px;
    margin-bottom: 16px;
    border-radius: 12px;
  }
  
  .category__main-details {
    gap: 20px;
  }
  
  .category__main-image {
    max-width: 140px;
    height: 140px;
    border-radius: 10px;
  }
  
  .category__main-details-left h2 {
    font-size: 18px;
    margin: 0 0 14px 0;
  }
  
  .category__main-details-left-features {
    font-size: 14px;
    gap: 6px;
  }
  
  .category__main-details-right {
    gap: 16px;
    padding-top: 14px;
    margin-left: 0;
  }
  
  .category__main-details-right-price {
    font-size: 24px;
  }
  
  .category__main-details-right-oldprice {
    font-size: 14px;
  }
  
  .in-stock-label {
    font-size: 15px;
    margin-bottom: 3px;
  }
  
  .category__main-details-right-btns {
    gap: 12px;
  }
  
  :deep(.main__list-item-inner-like) {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 10px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  :deep(.cart-action-button) {
    padding: 12px 20px;
    min-height: 44px;
    max-width: 160px;
    font-size: 15px;
  }
  
  .discount-widget {
    top: 16px;
    right: 16px;
    font-size: 14px;
    padding: 6px 10px;
    border-radius: 6px;
  }
  
  .added-to-cart,
  .max-quantity {
    top: -50px;
    padding: 12px 16px;
    font-size: 14px;
    border-radius: 10px;
  }
}
</style>