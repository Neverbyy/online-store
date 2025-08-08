<template>
  <div class="user-reviews">
    <h2>Мои отзывы</h2>
    <div v-if="userReviews.length === 0" class="user-reviews__empty">
      У вас пока нет отзывов.
    </div>
    <div v-else class="user-reviews__list">
      <div v-for="review in userReviews" :key="review.id" class="user-reviews__item">
        <div class="user-reviews__product">
          <router-link :to="getProductLink(review.productId)" class="user-reviews__product-link">
            {{ getProductName(review.productId) }}
          </router-link>
        </div>
        <div class="user-reviews__card">
          <reviewItem :review="review" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import reviewItem from './reviewItem.vue';
import { transliterate } from '../helpers/translit.js';
import { useProfileStore, useReviewStore, useMainStore } from '../store';

const profileStore = useProfileStore();
const reviewStore = useReviewStore();
const mainStore = useMainStore();

const userId = computed(() => profileStore.getUser?.id);

const userReviews = computed(() => {
  return reviewStore.reviews.filter(r => r.userId === userId.value);
});

const getProductName = (productId) => {
  const product = mainStore.getItemById?.(productId);
  return product ? product.name : 'Товар не найден';
};

const getProductLink = (productId) => {
  const product = mainStore.getItemById?.(productId);
  if (!product) return '#';
  return `/catalog/${product.category}/${transliterate(product.name)}/${product.id}`;
};

onMounted(() => {
  reviewStore.fetchReviews();
});
</script>

<style lang="scss" scoped>
.user-reviews {
  padding: 10px 0 0 0;
  &__empty {
    color: #888;
    margin-top: 18px;
    text-align: center;
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 28px 22px;
    margin-top: 18px;
  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-width: 340px;
    max-width: 400px;
  }
  &__product {
    font-size: 1.04rem;
    font-weight: 500;
    color: #750DC5;
    margin-bottom: 2px;
    margin-left: 2px;
  }
  &__product-link {
    color: #750DC5;
    text-decoration: underline;
    transition: color 0.18s;
    &:hover {
      color: #091D9E;
    }
  }
  &__card {
    background: #f8f6fd;
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(117, 13, 197, 0.09), 0 1.5px 8px rgba(0,0,0,0.04);
    padding: 22px 20px 18px 20px;
    width: 100%;
    box-sizing: border-box;
    transition: box-shadow 0.18s;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  h2 {
    color: #750DC5;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
  }
}

@media (max-width: 900px) {
  .user-reviews__list {
    flex-direction: column;
    gap: 16px;
  }

  .review-item{
    width: 100%;
  }
  .user-reviews__card {
    padding: 16px 14px 12px 14px;
  }
}

@media (max-width: 600px) {
  .user-reviews__list {
    flex-direction: column;
    gap: 12px;
  }
  .review-item{
    width: 100%;
  }
  .user-reviews__item {
    min-width: 100%;
    max-width: 100%;
    width: 100%;
  }
  .user-reviews__card {
    padding: 14px 12px 10px 12px;
  }
}
</style>