<script setup>
import Header from './components/Header.vue';

</script>

<template>
  <Header v-if="$route.meta.showHeader !== false" />

  <router-view></router-view>
</template>


<style lang="scss" scoped>

</style>
