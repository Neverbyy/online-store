<script setup>
import { defineProps, ref, computed } from 'vue'
import reviewDetailsModal from './reviewDetailsModal.vue'

const props = defineProps({
  review: Object
})

// Получаем имя пользователя по userId
const userName = computed(() => props.review.userName || 'Пользователь')

const isModalActive = ref(false)

// Моковые данные для аватара, имени и даты (заменить на реальные при интеграции)
const avatarUrl = computed(() => props.review.avatar || 'https://i.imgur.com/0y0y0y0.png') // заглушка
const reviewDate = computed(() => props.review.date || '—')

const openModal = () => {
  isModalActive.value = true
}

const closeModal = () => {
  isModalActive.value = false
}
</script>

<template>
<div class="review-item">
  <div class="review-item__header">
    <img :src="avatarUrl" alt="avatar" class="review-item__avatar" />
    <div class="review-item__user-block">
      <div class="review-item__user-row">
        <span class="review-item__user">{{ userName }}</span>
        <span class="review-item__date">{{ reviewDate }}</span>
      </div>
      <div class="review-item__stars">
        <span v-for="star in 5" :key="star" class="star" :class="{ 'star--active': star <= review.rating }">★</span>
      </div>
    </div>
  </div>
  <div class="review-item__details">
    <div class="review-item__adv"><strong>Достоинства:</strong> <span>{{ review.advantages }}</span></div>
    <div class="review-item__dis"><strong>Недостатки:</strong> <span>{{ review.disadvantages }}</span></div>
  </div>
  <button class="review-item__btn" @click="openModal">Читать полностью</button>
  <reviewDetailsModal :isActive="isModalActive" @close="closeModal" :review="review" />
</div>
</template>


<style lang="scss" scoped>
.review-item {
  border-radius: 12px;
  background-color: #fff;
  padding: 18px 18px 14px 18px;
  font-weight: 300;
  width: 340px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  word-break: break-word;
  font-size: 1.08rem;
  line-height: 1.5;
  
  @media (max-width: 600px) {
    width: 280px;
    flex-shrink: 0;
    scroll-snap-align: start;
    padding: 16px 16px 12px 16px;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 12px;
    flex-shrink: 0;
  }
  &__user-block {
    flex: 1;
  }
  &__user-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }
  &__user {
    font-size: 1.1rem;
    color: #444;
    font-weight: 400;
  }
  &__date {
    font-size: 1rem;
    color: #888;
    font-weight: 300;
  }
  &__stars {
    margin-top: 2px;
    margin-bottom: 2px;
  }
  &__details {
    margin: 12px 0 0 0;
  }
  &__adv, &__dis {
    margin-bottom: 6px;
    span {
      font-weight: 300;
      color: #444;
    }
    strong {
      font-weight: 700;
      margin-right: 3px;
    }
  }
  &__btn {
    color: #091D9E;
    background: none;
    border: none;
    padding: 0;
    margin-top: 10px;
    font-size: 1.08rem;
    cursor: pointer;
    text-decoration: underline;
    font-weight: 400;
    transition: color 0.2s;
    &:hover {
      color: #750DC5;
    }
  }
}

.star {
  font-size: 1.4rem;
  color: #D1C1E7;
  margin-right: 2px;
  &--active {
    color: #750DC5;
  }
}
</style>