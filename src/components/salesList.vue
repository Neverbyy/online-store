<script setup>
import SaleItem from './saleItem.vue';
import { useStore } from 'vuex';

const store = useStore();

const addToCart = (sale) => {
  store.dispatch('cart/addToCart', sale);
}

const props = defineProps({
  sales: Array
})

</script>

<template>

    <div class="main__list sales">
        <SaleItem 
        v-for="sale in sales"
        :key="sale.id"
        :name="sale.name"
        :imageUrl="sale.image"
        :price="sale.price"
        :addToCart="() => addToCart(sale)"
        />
    </div>

</template>