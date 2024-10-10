<script setup>
const props = defineProps({
  name: String,
  imageUrl: String,
  category: String
});
</script>

<template>
    <router-link :to="`/catalog/${category}`">
      <div class="main__list-item">
        <div class="main__list-item-inner">
          <img class="main__list-item-inner-image" :src="imageUrl" alt="1">
        </div>
        <span class="main__list-item-inner-name">{{name}}</span>
    </div>
    </router-link>
</template>


<style lang="scss" scoped>

</style>