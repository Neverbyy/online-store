<!-- ReviewDetailsModal.vue -->
<template>
    <div class="modal" :class="{ 'is-active': isActive }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <div class="box">
          <button class="modal-close is-large" @click="closeModal" aria-label="close"></button>
          <h1>Отзыв</h1>
          <div>
            <h2>Достоинства</h2>
            <p>{{ review.advantages }}</p>
          </div>
          <div>
            <h2>Недостатки</h2>
            <p>{{ review.disadvantages }}</p>
          </div>
          <div>
            <h2>Комментарий</h2>
            <p>{{ review.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isActive: {
      type: Boolean,
      required: true
    },
    review: {
      type: Object,
      required: true
    }
  });
  
  const emits = defineEmits(['close']);
  
  const closeModal = () => {
    emits('close');
  };
  </script>
  
  <style scoped>
  .modal {
    display: none;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
    overflow: hidden;
  }
  
  .modal.is-active {
    display: flex;
  }
  
  .modal-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    position: relative;
    z-index: 60;
    width: 50%;
    max-height: 90%;
    overflow: auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
  }
  
  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 70;
  }
  </style>
  