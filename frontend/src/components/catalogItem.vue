<script setup>
import { getImageUrl } from '../utils/imageUtils.js';

const props = defineProps({
  name: String,
  imageUrl: String,
  category: String
});

// Получаем правильный URL изображения
const correctImageUrl = getImageUrl(props.imageUrl);
</script>

<template>
      <div class="main__list-item">
        <router-link :to="`/catalog/${category}`">
        <div class="main__list-item-inner">
          <img class="main__list-item-inner-image" :src="correctImageUrl" :alt="name">
        </div>
        <span class="main__list-item-inner-name">{{name}}</span>
      </router-link>
    </div>
</template>


<style lang="scss" scoped>
  .main__list-item-inner-name{
    color: black;
    text-align: center;
    display: block;
  }

  @media (max-width: 400px) {
    .main__list{
      &-item{
        width: 100%;
        &-inner{
          &-image{
            height: 100%;
          }
        }
      }
    }
  }
</style>