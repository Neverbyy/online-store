<script setup>
import CartList from './CartList.vue';
import {computed} from 'vue';
import ButtonCart from './UI/buttonCart.vue';
import {useStore} from 'vuex';
import { getImageUrl } from '../utils/imageUtils.js';

const store = useStore();
const cart = computed(() => store.state.cart.cart);
const formattedTotalPrice = computed(() => store.getters['cart/formattedTotalPrice']);

// Получаем правильный URL изображения корзины
const cartImageUrl = getImageUrl('/src/assets/cart.png');

const clearCart = () => {
    store.dispatch('cart/clearCart');
};

</script>

<template>
    <div class="main container">
        <div class="cart">
            <div v-if="cart.length === 0" class="cart__inner">
                <h1>Ваша корзина пуста</h1>
                <img :src="cartImageUrl" alt=""> 
            </div>
            <div v-else>
                <CartList />
            </div>
            <div v-if="cart.length >= 2" class="cart-clearbtn">
                <ButtonCart @click="clearCart">Очистить всё</ButtonCart>
            </div>
            <div class="cart-info" v-if="cart.length === 0">
                <h2>Добавьте товары из каталога</h2>
                <router-link to="/catalog">
                <div class="cart-btn">
                <ButtonCart> Перейти в каталог</ButtonCart>
                </div>
                </router-link>
            </div>
            
            <div class="cart-payment" v-else>
                <h2> Итого: {{ formattedTotalPrice }} ₽</h2>
                <router-link to="/cart/order">
                    <div class="cart-btn"><ButtonCart> Оформить заказ </ButtonCart></div>
                </router-link>
            </div>
        </div>

    </div>
</template>


<style lang="scss" scoped>
.cart{
    flex-direction: column;
    display: flex;
    justify-content: center;
    background-color: #f7f5f5;
    border-radius: 8px;
    padding: 20px;

    &__inner{
        align-self: center;
    }
    h1,h2{
        text-align: center;
    }

    h2{
        margin-top: 28px;
    }

    &-btn{
        display: inline-block;
        margin: 0 auto;
    }

    &-clearbtn{
        display: flex;
        align-self: flex-end;
        margin-top: 45px;
    }

    &-payment {
        text-align: center;
    }
    &-info{
        text-align: center;
    }
}

// Адаптивные стили для планшетов
@media (max-width: 900px) {
    .main.container {
    padding: 0 16px;
    padding-bottom: 80px; // Отступ от мобильной навигации
  }
  .cart {
    padding: 16px;
    border-radius: 12px;
    
    h1 {
      font-size: 24px;
    }
    
    h2 {
      font-size: 20px;
      margin-top: 24px;
    }
    
    &-clearbtn {
      margin-top: 32px;
    }
  }
}

// Адаптивные стили для мобильных устройств
@media (max-width: 600px) {
  .cart {
    padding: 16px;
    border-radius: 16px;
    margin: 16px 0;
    
    h1 {
      font-size: 22px;
      margin-bottom: 16px;
    }
    
    h2 {
      font-size: 18px;
      margin-top: 20px;
    }
    
    &-clearbtn {
      margin-top: 24px;
      align-self: center;
    }
    
    &-btn {
      width: 100%;
      
      :deep(.btn-cart) {
        width: 100%;
        padding: 16px 24px;
        font-size: 16px;
        border-radius: 12px;
      }
    }
  }
}

@media (max-width: 480px) {
  .cart {
    padding: 12px;
    
    h1 {
      font-size: 20px;
    }
    
    h2 {
      font-size: 16px;
    }
  }
}
</style>