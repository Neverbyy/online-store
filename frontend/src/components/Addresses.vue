<template>
  <div>
    <div v-if="addresses.length === 0">Нет сохранённых адресов</div>
    <div v-for="(addr, idx) in addresses" :key="idx" class="address-item">
      {{ addr.city }}, {{ addr.street }}, {{ addr.home }}, кв. {{ addr.flat }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const addresses = computed(() => store.getters['profile/getUser'].addresses || []);
</script>

<style scoped>
.address-item {
  margin-bottom: 10px;
  padding: 8px 12px;
  border: 1px solid #750DC5;
  border-radius: 6px;
  background: #faf8ff;
}
</style>