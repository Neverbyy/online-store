<script setup>
import { ref, onMounted, onUnmounted} from 'vue';

const slides = ([
      '/src/assets/slide1.png',
      '/src/assets/slide2.png',
      '/src/assets/slide3.png',
      '/src/assets/slide4.png'
    ]);

const currentIndex = ref(0);

let intervalId;

const startAutoSlide = () => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.length;
  }, 9000);
};

onMounted(() => {
  startAutoSlide();
});

</script>

<template>
    <div class="slider">
    <div class="slide">
      <transition name="slide-fade" mode="out-in">
        <img
          :key="slides[currentIndex]"
          :src="slides[currentIndex]"
          alt="Slide"
          style="width: 1200px; height: 300px; object-fit: fill;"
        />
      </transition>
    </div>
  </div>
</template>


<style scoped lang="scss">
.slider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.slide {
  margin: 0 20px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>