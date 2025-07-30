<script setup>
import ButtonCart from './UI/buttonCart.vue';
import { defineProps } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { transliterate } from '../helpers/translit';
import { getImageUrl, getImageUrlForCSS } from '../utils/imageUtils.js';

const props = defineProps({
    item: Object,
    removeFromCart: Function
});

const store = useStore();
const router = useRouter();

// Получаем правильный URL изображения
const correctImageUrl = getImageUrl(props.item?.image);

// Получаем URL для CSS изображений
const addImageUrl = getImageUrlForCSS('/src/assets/add.png');
const removeImageUrl = getImageUrlForCSS('/src/assets/remove.png');

const increment = async () => {
    if (props.item.quantity < 20) {
        await store.dispatch('cart/incrementQuantity', props.item.id);
    }
};

const decrement = async () => {
    if (props.item.quantity > 1) {
        await store.dispatch('cart/decrementQuantity', props.item.id);
    }
};

const handleRemoveFromCart = async () => {
    await props.removeFromCart(props.item.id);
};

const handleProductClick = () => {
    // Проверяем, есть ли у товара категория
    if (!props.item.category) {
        console.warn('Товар не имеет категории:', props.item);
        return;
    }
    
    // Переходим на страницу товара
    router.push(`/catalog/${props.item.category}/${transliterate(props.item.name)}/${props.item.id}`);
};

</script>

<template>
    <div class="cart__main-item">
        <div class="cart__main-details">
            <img class="cart__main-image" :src="correctImageUrl" alt="" @click="handleProductClick">
            <div class="cart__main-details-left">
                <h2 class="cart__main-details-left-title" @click="handleProductClick">{{ item.name }}</h2>
                <h2>{{ item.price }} Руб.</h2>
                <div>
                <ul class="cart__main-details-left-features" v-for="(value, key) in item.features" :key="key"> 
                    <li>{{ key + ' ' + value + ' '}}</li>
                </ul>
                </div>
            </div>
            <div class="cart__main-details-right">
                <div class="cart__main-details-right-btns">
                    <ButtonCart @click="handleRemoveFromCart"><slot>Удалить</slot></ButtonCart>
                    <div class="cart__main-item-counter">
                        <button 
                            class="counter-btn decrement"
                            :class="{disabled: item.quantity === 1 }"
                            @click="decrement">
                        </button>
                            <span>{{ item.quantity }}</span>
                        <button 
                            class="counter-btn increment"
                            :class="{ disabled: item.quantity === 20 }"
                            @click="increment">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.cart__main{

    &-image{
        max-width: 200px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        cursor: pointer;
        
        &:hover {
            transform: scale(1.02);
        }
    }
    
    &-item{
        background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
        border-radius: 16px;
        padding: 24px;
        margin: 16px 0;
        box-shadow: 0 2px 20px rgba(117, 13, 197, 0.08);
        border: 1px solid rgba(117, 13, 197, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
            box-shadow: 0 8px 32px rgba(117, 13, 197, 0.12);
            transform: translateY(-1px);
        }
    }

    &-details{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;

        &-left{
            flex: auto;
            margin-left: 0;

            h2 {
                margin: 0 0 8px 0;
                font-weight: 600;
                color: #2d3748;
                font-size: 1.25rem;
                line-height: 1.4;
                
                &:last-of-type {
                    color: #750DC5;
                    font-weight: 700;
                    font-size: 1.5rem;
                    margin-bottom: 16px;
                }
            }
            
            &-title {
                cursor: pointer;
                transition: color 0.3s ease;
                display: inline-block;
                
                &:hover {
                    color: #750DC5;
                }
            }

            &-features{
                font-weight: 400;
                color: #718096;
                font-size: 0.95rem;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                list-style: none;

                li{
                    padding: 4px 0;
                    position: relative;
                    padding-left: 16px;
                    
                    &::before {
                        content: '•';
                        color: #750DC5;
                        font-weight: bold;
                        position: absolute;
                        left: 0;
                    }
                }
            }
        }
        
        &-right{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;

            &-btns{
                display: flex;
                column-gap: 30px;
                align-items: center;
            }
        }
    }
}

.cart__main-item-counter {
  display: flex;
  align-items: center;
  gap: 5px;
  border: solid 1px #750DC5;
  border-radius: 8px;
  width: 100px;
  justify-content: space-between;
}

.counter-btn {
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: #750DC5;
  background-color: transparent;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover:not(.disabled) {
    background-color: rgba(117, 13, 197, 0.1);
    transform: scale(1.1);
  }
  
  &:active:not(.disabled) {
    transform: scale(0.95);
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
      transform: none;
    }
  }
}

.counter-btn.decrement::before,
.counter-btn.increment::before {
  content: '';
  width: 14px;
  height: 14px;
  background-repeat: no-repeat;
}

.counter-btn.increment::before {
  background-image: v-bind(addImageUrl);
}
.counter-btn.decrement::before {
  background-image: v-bind(removeImageUrl);
  align-self: flex-end;
}

// Адаптивные стили для планшетов
@media (max-width: 900px) {
  .cart__main {
    &-image {
      max-width: 160px;
      border-radius: 10px;
    }
    
    &-item {
      padding: 20px;
      margin: 12px 0;
      border-radius: 14px;
    }
    
    &-details {
      gap: 20px;
      
      &-left {
        h2 {
          font-size: 1.1rem;
          
          &:last-of-type {
            font-size: 1.3rem;
            margin-bottom: 12px;
          }
        }
        
        &-features {
          font-size: 0.9rem;
          
          li {
            padding: 3px 0;
            padding-left: 14px;
          }
        }
      }
      
      &-right {
        &-btns {
            flex-direction: column;
            gap: 20px;
        }
      }
    }
  }
  
  .cart__main-item-counter {
    width: 90px;
  }
  
  .counter-btn {
    width: 28px;
    height: 28px;
    font-size: 16px;
    
    &:hover:not(.disabled) {
      background-color: rgba(117, 13, 197, 0.1);
      transform: scale(1.1);
    }
    
    &:active:not(.disabled) {
      transform: scale(0.95);
    }
  }
}

// Адаптивные стили для мобильных устройств
@media (max-width: 600px) {
  .cart__main {
    &-image {
      max-width: 120px;
      border-radius: 8px;
    }
    
    &-item {
      padding: 16px;
      margin: 8px 0;
      border-radius: 12px;
    }
    
    &-details {
      flex-direction: column;
      gap: 16px;
      
      &-left {
        
        h2 {
          font-size: 1rem;
          margin: 0 0 6px 0;
          
          &:last-of-type {
            font-size: 1.2rem;
            margin-bottom: 10px;
          }
        }
        
        &-features {
          font-size: 0.85rem;
          
          li {
            padding: 2px 0;
            padding-left: 12px;
          }
        }
      }
      
      &-right {
        width: 100%;
        align-items: stretch;
        
        &-btns {
          flex-direction: column;
          gap: 16px;
          width: 100%;
          
          :deep(.btn-cart) {
            width: 100%;
            padding: 12px 20px;
            font-size: 14px;
            border-radius: 10px;
          }
        }
      }
    }
  }
  
  .cart__main-item-counter {
    width: 120px;
    height: 40px;
    align-self: center;
  }
  
  .counter-btn {
    width: 32px;
    height: 32px;
    font-size: 18px;
    
    &:hover:not(.disabled) {
      background-color: rgba(117, 13, 197, 0.1);
      transform: scale(1.1);
    }
    
    &:active:not(.disabled) {
      transform: scale(0.95);
    }
  }
}

// Адаптивные стили для очень маленьких экранов
@media (max-width: 480px) {
  .cart__main {
    &-image {
      border-radius: 6px;
    }
    
    &-item {
      padding: 12px;
      margin: 6px 0;
    }
    
    &-details {
      gap: 12px;
      
      &-left {
        h2 {
          font-size: 0.95rem;
          
          &:last-of-type {
            font-size: 1.1rem;
          }
        }
        
        &-features {
          font-size: 0.8rem;
          
          li {
            padding: 1px 0;
            padding-left: 10px;
          }
        }
      }
      
      &-right {
        &-btns {
          gap: 12px;
          
          :deep(.btn-cart) {
            padding: 10px 16px;
            font-size: 13px;
          }
        }
      }
    }
  }
  
  .cart__main-item-counter {
    width: 100px;
    height: 36px;
  }
  
  .counter-btn {
    width: 28px;
    height: 28px;
    font-size: 16px;
    
    &:hover:not(.disabled) {
      background-color: rgba(117, 13, 197, 0.1);
      transform: scale(1.1);
    }
    
    &:active:not(.disabled) {
      transform: scale(0.95);
    }
  }
}
</style>