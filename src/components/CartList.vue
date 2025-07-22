<script setup>
import CartItem from './CartItem.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const cart = computed(() => store.state.cart.cart);

const removeFromCart = async (id) => {
    await store.dispatch('cart/removeFromCart', id);
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