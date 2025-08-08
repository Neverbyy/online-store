<script setup>
import buttonCart from './UI/buttonCart.vue';
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useProfileStore, useReviewStore } from '../store'

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['reviewAdded'])

const authStore = useAuthStore()
const profileStore = useProfileStore()
const reviewStore = useReviewStore()
const router = useRouter()

const userId = computed(() => authStore.getUser?.id)
const userName = computed(() => profileStore.getName)
const advantages = ref('')
const disadvantages = ref('')
const text = ref('')
const rating = ref(0)
const hoverRating = ref(0)
const ratingError = ref(false)
const profileError = ref(false)

const getCurrentDate = () => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}`
}

const handleSubmit = async () => {
  // Сброс ошибок
  ratingError.value = false
  profileError.value = false

  // Проверка рейтинга
  if (rating.value === 0) {
    ratingError.value = true
    return
  }

  // Проверка имени пользователя
  if (!userName.value || userName.value.trim() === '') {
    profileError.value = true
    return
  }

  const newReview = {
    productId: props.productId,
    advantages: advantages.value,
    disadvantages: disadvantages.value,
    text: text.value,
    rating: rating.value,
    userId: userId.value,
    userName: userName.value,
    date: getCurrentDate()
  }

  try {
    await reviewStore.addReviewAsync(newReview)
    resetForm()
    emit('reviewAdded')
  } catch (error) {
    console.error('Ошибка при добавлении отзыва:', error)
  }
}

const setRating = (value) => {
  rating.value = value
  ratingError.value = false
}

const setHoverRating = (value) => {
  hoverRating.value = value
}

const resetForm = () => {
  advantages.value = ''
  disadvantages.value = ''
  text.value = ''
  rating.value = 0
  ratingError.value = false
  profileError.value = false
}

const goToProfile = () => {
  router.push({ name: 'Profile' })
}
</script>

<template>
  <h1>Написать отзыв</h1>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <input type="text" id="advantages" v-model="advantages" placeholder="Достоинства" required>
    </div>
    <div class="form-group">
      <textarea id="disadvantages" v-model="disadvantages" placeholder="Недостатки" required></textarea>
    </div>
    <div class="form-group">
      <textarea id="text" v-model="text" placeholder="Комментарий" required></textarea>
    </div>
    <div class="rating">
      <label>Оценка</label>
      <div class="rating__inner">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ 'active': star <= rating || star <= hoverRating }"
          @click="setRating(star)"
          @mouseover="setHoverRating(star)"
          @mouseleave="setHoverRating(0)"
        >
          ★
        </span>
      </div>
    </div>
    <div v-if="ratingError" class="error">Пожалуйста, выберите оценку.</div>
    <div v-if="profileError" class="error profile-error">
      <p>Для оставления отзыва необходимо заполнить имя в профиле.</p>
      <button type="button" class="profile-link" @click="goToProfile">Перейти в профиль</button>
    </div>
    <buttonCart type="submit">Добавить отзыв</buttonCart>
  </form>
</template>

<style lang="scss" scoped>
.form-group {
  background-color: #f2f2f2;
  margin-top: 12px;
  border: none;
  border-radius: 8px;
  box-sizing: border-box;
  color: #333;
  display: inline-block;
  height: 70px;
  overflow: hidden;
  position: relative;
  transition: height .2s ease 0s;
  width: 100%;
  z-index: 0;
}

input, textarea {
  background: transparent;
  border: none;
  box-sizing: border-box;
  color: #333;
  cursor: text;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  height: 100%;
  left: 0;
  line-height: 20px;
  outline: none;
  overflow: hidden;
  padding: 28px 16px 20px;
  resize: none;
  top: 0;
  width: 100%;
}

.rating{
  margin: 20px 0px;
  &__inner{
    display: flex;
  }
}
.star {
  font-size: 2rem;
  color: #cfcece;
  cursor: pointer;

  &.active {
    color: #750DC5;
  }
  
  &:hover {
    color: #750DC5;
  }
}
.error {
  color: red;
  font-size: 0.9em;
  margin: 10px 0;
}

.profile-error {
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  padding: 12px;
  margin: 15px 0;
  
  p {
    margin: 0 0 10px 0;
    color: #c53030;
  }
}

.profile-link {
  background-color: #750DC5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #5a0a9a;
  }
}
</style>
