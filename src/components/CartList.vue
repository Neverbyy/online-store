<script setup>
import CartItem from './CartItem.vue';
import { useStore } from 'vuex';

const store = useStore();
const cart = store.getters['cart/getCart'];

const removeFromCart = (id) => {
    store.dispatch('cart/removeFromCart', id);
};
</script>


<template>
    <CartItem
    v-for="(item,index) in cart"
    :key="item.id"
    :item="item"
    :removeFromCart="removeFromCart"
    />
</template>

<style lang="scss" scoped>

</style>