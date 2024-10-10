<script setup>
import { defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true
  }
});

const emits = defineEmits(['close']);

const closeModal = () => {
  emits('close');
};

</script>

<template>
    <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="box">
        <slot></slot>
      </div>
    </div>
    <button class="modal-close is-large" @click="closeModal" aria-label="close"></button>
  </div>
</template>


<style lang="scss" scoped>
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

  &::before{
    content: "\e014";
  }
}

.modal-content {
  position: relative;
  z-index: 60;
  max-width: 90%;
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