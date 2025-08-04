<script setup>
import { defineProps, ref, computed, onMounted, onUnmounted } from 'vue';
import CartActionButton from './UI/CartActionButton.vue';
import { useStore } from 'vuex';
import FavoriteIcon from './UI/FavoriteIcon.vue';
import { getImageUrl } from '../utils/imageUtils.js';
import { useDiscount } from '../composables/useDiscount.js';

const props = defineProps({
  product: Object
});

const store = useStore();
const showAddedMessage = ref(false);
const selectedImageIndex = ref(0);
const slideDirection = ref('right'); // Направление анимации
const showFullscreen = ref(false); // Состояние полноэкранного просмотра

// Получаем все изображения товара (основное + дополнительные)
const productImages = computed(() => {
  const images = [];
  
  // Добавляем основное изображение
  if (props.product?.image) {
    images.push(getImageUrl(props.product.image));
  }
  
  // Добавляем дополнительные изображения (если есть)
  if (props.product?.additionalImages && Array.isArray(props.product.additionalImages)) {
    props.product.additionalImages.forEach(img => {
      images.push(getImageUrl(img));
    });
  }
  
  // Если нет дополнительных изображений, дублируем основное для демонстрации
  if (images.length === 1) {
    images.push(images[0], images[0], images[0]); // Добавляем еще 3 копии для демо
  }
  
  return images;
});

// Текущее выбранное изображение
const currentImage = computed(() => productImages.value[selectedImageIndex.value]);

// Функция для выбора изображения
const selectImage = (index) => {
  // Определяем направление анимации
  if (index > selectedImageIndex.value) {
    slideDirection.value = 'right'; // Следующее изображение
  } else if (index < selectedImageIndex.value) {
    slideDirection.value = 'left'; // Предыдущее изображение
  }
  selectedImageIndex.value = index;
};

// Используем composable для вычисления скидки и экономии
const { discountPercentage, savingsAmount } = useDiscount(computed(() => props.product));

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

// Функции для полноэкранного просмотра
const openFullscreen = () => {
  showFullscreen.value = true;
  document.body.style.overflow = 'hidden'; // Блокируем скролл
};

const closeFullscreen = () => {
  showFullscreen.value = false;
  document.body.style.overflow = ''; // Восстанавливаем скролл
};

// Обработка клавиши Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape' && showFullscreen.value) {
    closeFullscreen();
  }
};

// Обработка клика вне изображения
const handleBackdropClick = (event) => {
  if (event.target.classList.contains('fullscreen-backdrop')) {
    closeFullscreen();
  }
};

// Функции навигации по изображениям
const handlePrevious = () => {
  if (selectedImageIndex.value > 0) {
    selectImage(selectedImageIndex.value - 1);
  }
};

const handleNext = () => {
  if (selectedImageIndex.value < productImages.value.length - 1) {
    selectImage(selectedImageIndex.value + 1);
  }
};

// Добавляем и удаляем обработчики событий
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  // Восстанавливаем скролл при размонтировании компонента
  document.body.style.overflow = '';
});
</script>
<template>
    <div class="main container">
      <div class="product-card">
        <div class="product-card__inner">
          <!-- Галерея изображений -->
          <div class="product-gallery">
            <!-- Миниатюры слева -->
            <div class="gallery-thumbnails">
              <div 
                v-for="(image, index) in productImages" 
                :key="index"
                :class="['thumbnail', { active: selectedImageIndex === index }]"
                @click="selectImage(index)"
              >
                <img :src="image" :alt="`${product.name} - вид ${index + 1}`">
              </div>
            </div>
            
                         <!-- Основное изображение справа -->
             <div class="gallery-main">
               <transition :name="slideDirection === 'right' ? 'slide-right' : 'slide-left'" mode="out-in">
                 <img 
                   :key="selectedImageIndex"
                   class="product-card-image" 
                   :src="currentImage" 
                   :alt="product.name"
                   @click="openFullscreen"
                   style="cursor: pointer;"
                 >
               </transition>
             </div>
          </div>
          
          <div class="product-card-details">
            <h1>Характеристики:</h1>
            <div class="product-card-details-inner"
            v-for="(value, key) in product.features" :key="key">
            <div class="one">{{ key }}</div>
            <div class="two">{{ value }}</div>
            </div>
          </div>
          <div class="product-card-buy">
                         <div class="product-card-price">
                 <h2 class="current-price">{{ product.price }} ₽</h2>
                 <span v-if="product.oldPrice && product.isSale" class="old-price">{{ product.oldPrice }} ₽</span>
             </div>
             <div v-if="product.oldPrice && product.isSale" class="discount-widgets">
               <div class="discount-percentage">-{{ discountPercentage }}%</div>
               <div class="savings-amount">Экономия {{ savingsAmount.toLocaleString() }} ₽</div>
             </div>
            <div class="product-card-buy-row">
              <FavoriteIcon :active="isFavorite" @click="handleToggleFavorite" width="40" height="40" style="cursor:pointer;"/>
              
              <div class="product-card-btn">
                <div :class="['added-to-cart', { show: showAddedMessage }]">Товар добавлен!</div>
                <CartActionButton :product="product" :onAdded="handleShowAddedMessage" />
              </div>
            </div>
          </div>
                 </div>
       </div>
     </div>
     
     <!-- Полноэкранный просмотр -->
     <div 
       v-if="showFullscreen" 
       class="fullscreen-backdrop"
       @click="handleBackdropClick"
       @keydown="handleKeydown"
       tabindex="0"
     >
       <div class="fullscreen-content">
         <button class="fullscreen-close" @click="closeFullscreen">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
             <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
         </button>
         
                   <div class="fullscreen-gallery">
            <!-- Основное изображение в полноэкранном режиме -->
            <div class="fullscreen-main">
              <transition :name="slideDirection === 'right' ? 'slide-right' : 'slide-left'" mode="out-in">
                <img 
                  :key="selectedImageIndex"
                  class="fullscreen-image" 
                  :src="currentImage" 
                  :alt="product.name"
                >
              </transition>
              
              <!-- Стрелка влево -->
              <button 
                v-if="selectedImageIndex > 0"
                class="fullscreen-arrow fullscreen-arrow-left" 
                @click="handlePrevious"
                aria-label="Предыдущее изображение"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              
              <!-- Стрелка вправо -->
              <button 
                v-if="selectedImageIndex < productImages.length - 1"
                class="fullscreen-arrow fullscreen-arrow-right" 
                @click="handleNext"
                aria-label="Следующее изображение"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
       </div>
     </div>
   </template>

<style lang="scss" scoped>

.two{
  color: #000;
}

.container{
  max-width: 1480px;
}

// Стили для галереи изображений
.product-gallery {
  display: flex;
  gap: 50px;
  align-items: flex-start;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
}

.gallery-thumbnails {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 80px;
  
  @media (max-width: 900px) {
    flex-direction: row;
    order: 2;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
    justify-content: center;
    min-width: auto;
  }
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #750DC5;
    transform: scale(1.05);
  }
  
  &.active {
    border-color: #750DC5;
    box-shadow: 0 2px 8px rgba(117, 13, 197, 0.3);
  }
  
  img {
    width: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 900px) {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }
}

 .gallery-main {
   flex: 1;
   display: flex;
   justify-content: center;
   overflow: hidden; // Важно для анимации
   
   @media (max-width: 900px) {
     order: 1;
     width: 100%;
     justify-content: center;
   }
 }

// Анимации для смены изображений
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

// Анимация вправо (следующее изображение)
.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

// Анимация влево (предыдущее изображение)
.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-enter-to,
.slide-right-leave-from,
.slide-left-enter-to,
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.product-card__inner{
  display: flex;
  justify-content: space-between;
  position: relative;

.product-card-btn{
  position: relative;
}
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 20px;
  }
}
.product-card-buy {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  @media (max-width: 900px) {
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
    width: 320px;
    height: auto;
    border-radius: 8px;
    object-fit: contain;
    
    @media (max-width: 900px) {
      width: 100%;
      max-width: 400px;
      height: auto;
      border-radius: 8px;
      margin: 0 auto;
      display: block;
    }
    
    @media (max-width: 600px) {
      max-width: 350px;
    }
    
    @media (max-width: 480px) {
      max-width: 300px;
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
    
    @media (max-width: 900px) {
      row-gap: 16px;
      padding: 0 16px;
    }
    
    &-inner{
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 16px;
      
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
      }
    }
  }
}

// Стили для цен
.product-card-price {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.current-price {
  margin: 0;
  color: #333;
  font-weight: 700;
}

.old-price {
  font-size: 16px;
  color: #888;
  font-weight: 400;
  text-decoration: line-through;
  
  @media (max-width: 600px) {
    font-size: 14px;
  }
}

// Стили для виджетов скидки
.discount-widgets {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  
  @media (max-width: 600px) {
    margin-top: 10px;
    gap: 6px;
  }
}

.discount-percentage {
  background-color: #000;
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  
  @media (max-width: 600px) {
    padding: 5px 10px;
    font-size: 13px;
  }
}

.savings-amount {
  background-color: #90EE90;
  color: #333;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  
  @media (max-width: 600px) {
    padding: 5px 10px;
    font-size: 13px;
  }
}

.added-to-cart{
  top: -35px;
}

@media (max-width: 900px) {
  .added-to-cart{
    top: -50px
  }
}

@media (max-width: 600px) {
  .added-to-cart{
    top: -35px
  }
}

@media (max-width: 400px) {
  .added-to-cart{
    width: 155px;
  }
}

 .one{
   border-bottom: 1px dotted #595555;
 }

// Стили для полноэкранного просмотра
.fullscreen-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  padding: 20px;
}

.fullscreen-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fullscreen-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
  }
}

.fullscreen-gallery {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}



.fullscreen-main {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.fullscreen-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;

}

// Стили для стрелок навигации
.fullscreen-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
}

.fullscreen-arrow-left {
  left: 20px;
  
  @media (max-width: 768px) {
    left: 10px;
  }
}

.fullscreen-arrow-right {
  right: 20px;
  
  @media (max-width: 768px) {
    right: 10px;
  }
}

// Анимация появления полноэкранного режима
.fullscreen-backdrop {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>