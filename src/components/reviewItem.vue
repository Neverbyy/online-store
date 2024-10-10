<script setup>
import { defineProps, ref, computed } from 'vue';
import reviewDetailsModal from './reviewDetailsModal.vue';

const props = defineProps({
  review: Object
});

const isModalActive = ref(false);

const openModal = () => {
  isModalActive.value = true;
};

const closeModal = () => {
  isModalActive.value = false;
};

</script>

<template>
<div class="review-item">
  <div class="review-item__inner">
    <div class="rating">
      <span v-for="star in review.rating" :key="star" class="star">
        ★
      </span>
    </div>
    <div class="review-item-details"><strong>Достоинства:</strong>{{ review.advantages }}</div>
    <div class="review-item-details"><strong>Недостатки:</strong>{{ review.disadvantages }}</div>
  </div>
  <button class="review-item-btn" @click="openModal">Читать полностью</button>
    <reviewDetailsModal :isActive="isModalActive" @close="closeModal" :review="review" />
</div>
</template>


<style lang="scss" scoped>
.review-item{
  border-radius: 8px;
  background-color: #ffffff;
  padding: 5px;
  font-weight: 300;
  width: 250px;

  &-details{
    margin-top: 10px;
  }
  &-btn{
    color: #091D9E;
    margin-top: 10px;
  }
}

.star{
  font-size: 1.5rem;
  color: #750DC5;
}
</style>