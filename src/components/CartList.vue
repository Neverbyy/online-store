<script setup>
import CartItem from './CartItem.vue';
import { useStore } from 'vuex';

const store = useStore();
const cart = store.getters['cart/getCart'];

const removeFromCart = (index) => {
    store.dispatch('cart/removeFromCart', index);
};
</script>


<template>
    <CartItem
    v-for="(item,index) in cart"
    :key="index"
    :item="item"
    :index="index"
    :removeFromCart="removeFromCart"
    />
</template>

<style lang="scss" scoped>

</style>