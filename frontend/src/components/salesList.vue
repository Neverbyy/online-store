<script setup>
import SaleItem from './saleItem.vue'
import { useCartStore } from '../store'

const cartStore = useCartStore()

const addToCart = (sale) => {
  cartStore.addToCartAsync(sale)
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
        :product="sale"
        :addToCart="() => addToCart(sale)"
        />
    </div>

</template>