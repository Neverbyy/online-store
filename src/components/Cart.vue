<script setup>
import CartList from './CartList.vue';
import {computed} from 'vue';
import ButtonCart from './UI/buttonCart.vue';
import {useStore} from 'vuex';

const store = useStore();
const cart = computed(() => store.getters['cart/getCart']);
const formattedTotalPrice = computed(() => store.getters['cart/formattedTotalPrice']);

const clearCart = () => {
    store.dispatch('cart/clearCart');
};

</script>

<template>
    <div class="main container">
        <div class="cart">
            <div v-if="cart.length === 0" class="cart__inner">
                <h1>Ваша корзина пуста</h1>
                <img src="/src/assets/cart.png" alt=""> 
            </div>
            <div v-else>
                <CartList />
            </div>
            <div v-if="cart.length >= 2" class="cart-clearbtn">
                <ButtonCart @click="clearCart">Очистить всё</ButtonCart>
            </div>
            <div v-if="cart.length === 0">
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
        display: flex;
        justify-content: center;
    }

    &-clearbtn{
        display: flex;
        align-self: flex-end;
        margin-top: 45px;
    }

}
</style>