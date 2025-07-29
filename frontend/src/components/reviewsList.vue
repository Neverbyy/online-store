<script setup>
import reviewItem from './reviewItem.vue';
import { defineProps } from 'vue';

const props = defineProps({
  reviews: Array
});
</script>

<template>
    <div class="review-list">
        <reviewItem
        v-for="review in reviews" 
        :key="review.id" 
        :review="review"/>
    </div>
</template>


<style lang="scss" scoped>
.review-list{
    display: flex;
    column-gap: 15px;
    background-color: #BCC5FF;
    padding: 20px;
    
    @media (max-width: 600px) {
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        padding: 16px;
        gap: 12px;
        
        /* Скрываем скроллбар для WebKit браузеров */
        &::-webkit-scrollbar {
            display: none;
        }
        
        /* Скрываем скроллбар для Firefox */
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
}
</style>