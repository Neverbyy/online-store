<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['update:searchText']);

const searchText = ref('');

const updateSearch = (event) => {
  searchText.value = event.target.value;
  emit('update:searchText', searchText.value);
};
</script>

<template>
  <input 
    placeholder="Поиск" 
    v-model="searchText" 
    @input="updateSearch"
  >
</template>

<style lang="scss" scoped>
input {
  height: var(--input-height);
  border-radius: 8px;
  background-color: #DEDEDE;
  border: none;
  padding: 20px;
  width: 750px;
  font-weight: 200;
  outline: none;
}

@media (max-width: 400px) {
  input {
    max-width: 165px;
  }
}
</style>