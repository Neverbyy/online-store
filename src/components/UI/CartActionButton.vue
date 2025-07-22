<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const props = defineProps({
  product: { type: Object, required: true },
  onAdded: Function
});

const store = useStore();
const router = useRouter();

const isInCart = computed(() => {
  return store.getters['cart/getCart'].some(item => item.id === props.product.id);
});

const handleClick = () => {
  if (isInCart.value) {
    router.push('/cart');
    return;
  }
  store.dispatch('cart/addToCart', props.product);
  if (props.onAdded) props.onAdded();
};
</script>

<template>
  <button
    class="cart-action-btn"
    :class="{ 'in-cart': isInCart }"
    @click="handleClick"
  >
    <span v-if="!isInCart">В корзину</span>
    <span v-else>В корзине</span>
  </button>
</template>

<style lang="scss" scoped>
.cart-action-btn {
  background-color: #750DC5;
  padding: 12px 40px;
  color: var(--color-white);
  margin-top: auto;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-weight: 500;
  font-size: 16px;

  &:hover {
    background-color: #5a0a9a;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(117, 13, 197, 0.3);
  }

  &.in-cart {
    background-color: #fff;
    color: #750DC5;
    border: 2px solid #750DC5;
    box-shadow: 0 4px 15px rgba(117, 13, 197, 0.08);
    cursor: pointer;
    &:hover {
      background-color: #f3eaff;
      color: #5a0a9a;
      border-color: #5a0a9a;
    }
  }
}
</style> 