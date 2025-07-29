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
// Адаптивные стили для планшетов
@media (max-width: 900px) {
  // Уменьшаем отступы между товарами
  :deep(.cart__main-item) {
    margin: 12px 0;
    padding: 20px;
  }
}

// Адаптивные стили для мобильных устройств
@media (max-width: 600px) {
  // Убираем отступы между товарами на мобильных
  :deep(.cart__main-item) {
    margin: 8px 0;
    padding: 16px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  :deep(.cart__main-item) {
    margin: 6px 0;
    padding: 12px;
  }
}
</style>