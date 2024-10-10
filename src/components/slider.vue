<script setup>
import { ref } from 'vue';

const slides = ([
      '/src/assets/slide.webp',
      '/src/assets/slide2.webp',
      '/src/assets/slide3.webp'
    ]);

const currentIndex = ref(0);
// Функция для переключения на предыдущий слайд
const prevSlide = () => {
  if (currentIndex.value  > 0) {
    currentIndex.value--;
  }
};

// Функция для переключения на следующий слайд
const nextSlide = () => {
  if (currentIndex.value  < slides.length - 1) {
    currentIndex.value++;
  }
};
</script>

<template>
    <div class="slider">
    <button class="slide-btn left" @click="prevSlide" :disabled="currentIndex === 0"></button>
    <div class="slide">
      <transition name="slide-fade" mode="out-in">
        <img :key="slides[currentIndex]" style="width: 1200px; height: 300px; object-fit: fill;" :src="slides[currentIndex]" alt="Slide" />
      </transition>
    </div>
    <button class="slide-btn right" @click="nextSlide" :disabled="currentIndex === slides.length - 1"></button>
  </div>
</template>


<style lang="scss" scoped>
.slider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.slide {
  margin: 0 20px;
}

button {
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
}

.slide-btn{
  border-radius: 50%;
  width: 50px;
  height: 45px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;

  &::before{
  font-size: 24px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  }

}

.slide-btn.left::before{
    content: '🠈';
  }

  .right::before {
  content: '🠊'; 
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.5s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
}
</style>