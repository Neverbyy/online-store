<!-- ReviewDetailsModal.vue -->
<template>
    <div class="modal" :class="{ 'is-active': isActive }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <button class="modal-close" @click="closeModal" aria-label="close">×</button>
        <div class="modal-header">
          <span class="modal-user">{{ review.userName || 'Пользователь' }}</span>
          <span class="modal-date">{{ review.date || '—' }}</span>
        </div>
        <div class="modal-stars">
          <span v-for="star in 5" :key="star" class="star" :class="{ 'star--active': star <= review.rating }">★</span>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <div class="modal-label">Достоинства</div>
            <div class="modal-text">{{ review.advantages }}</div>
          </div>
          <div class="modal-section">
            <div class="modal-label">Недостатки</div>
            <div class="modal-text">{{ review.disadvantages }}</div>
          </div>
          <div class="modal-section">
            <div class="modal-label">Комментарий</div>
            <div class="modal-text">{{ review.text }}</div>
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
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    overflow: hidden;
    background: rgba(34, 34, 34, 0.18);
  }
  .modal.is-active {
    display: flex;
    animation: fadeIn 0.22s;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .modal-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(34, 34, 34, 0.22);
    backdrop-filter: blur(2px);
  }
  .modal-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 410px;
    background: #faf8ff;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(117, 13, 197, 0.13), 0 1.5px 8px rgba(0,0,0,0.07);
    padding: 32px 22px 24px 22px;
    animation: modalPop 0.22s;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  @keyframes modalPop {
    from { transform: translateY(40px) scale(0.97); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
  .modal-close {
    position: absolute;
    top: -18px;
    right: -18px;
    width: 38px;
    height: 38px;
    border: none;
    background: rgba(255,255,255,0.85);
    color: #750DC5;
    border-radius: 50%;
    font-size: 1.7rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(117, 13, 197, 0.09);
    transition: background 0.2s, color 0.2s;
    z-index: 10;
  }
  .modal-close:hover {
    background: #750DC5;
    color: #fff;
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    gap: 10px;
  }
  .modal-user {
    font-size: 1.08rem;
    font-weight: 600;
    color: #750DC5;
    letter-spacing: 0.01em;
  }
  .modal-date {
    font-size: 0.97rem;
    color: #aaa;
    font-weight: 400;
  }
  .modal-stars {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 18px;
    margin-top: 2px;
    gap: 1px;
  }
  .star {
    font-size: 1.45rem;
    color: #D1C1E7;
    margin-right: 2px;
    transition: color 0.18s;
  }
  .star--active {
    color: #750DC5;
  }
  .modal-body {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 1.5px 8px rgba(117, 13, 197, 0.04);
    padding: 18px 12px 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    animation: fadeIn 0.3s;
  }
  .modal-section {
    margin-bottom: 0;
  }
  .modal-label {
    font-size: 1.04rem;
    font-weight: 500;
    color: #750DC5;
    margin-bottom: 2px;
  }
  .modal-text {
    font-size: 1rem;
    color: #222;
    line-height: 1.6;
    margin: 0;
    word-break: break-word;
  }
  @media (max-width: 600px) {
    .modal-content {
      max-width: 98vw;
      padding: 14px 2vw 14px 2vw;
    }
    .modal-title {
      font-size: 1.15rem;
    }
    .modal-body {
      padding: 10px 2vw 8px 2vw;
    }
  }
  </style>
  