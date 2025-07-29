<script setup>
import catalogItem from './catalogItem.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const isHomePage = computed(() => route.name === 'Home');

const props = defineProps({
  products: Array
})
</script>

<template>
    <div :class="['main__list', { 'catalog__list': !isHomePage }]">

        <catalogItem 
        v-for="product in products"
        :key="product.id"
        :name="product.name"
        :imageUrl="product.image"
        :category="product.category"
        />
        
    </div>
</template>


<style lang="scss" scoped>

</style>