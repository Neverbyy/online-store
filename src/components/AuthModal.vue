<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import FormInput from './UI/FormInput.vue';
import buttonCart from '/src/components/UI/buttonCart.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'submit', 'switch']);
const store = useStore();

const phone = ref('');
const password = ref('');
const confirmPassword = ref('');

const isRegister = computed(() => props.type === 'register');
const modalTitle = computed(() => (isRegister.value ? 'Регистрация' : 'Войти'));

const handleSubmit = async () => {
  if (isRegister.value && password.value !== confirmPassword.value) {
    alert('Пароли не совпадают!');
    return;
  }

  const payload = {
    phone: phone.value,
    password: password.value,
  };

  if (isRegister.value) {
    const success = await store.dispatch('auth/register', payload);
    if (success) {
      emit('switch', 'login');
    }
  } else {
    const success = await store.dispatch('auth/login', payload);
    console.log('Login success:', success); // Отладочная информация
    if (success) {
      emit('close'); // Закрываем модальное окно только при успешном входе
    }
  }
};

const closeModal = () => {
  emit('close');
};

const switchModal = () => {
  emit('switch', isRegister.value ? 'login' : 'register');
};

const switchText = computed(() =>
  isRegister.value ? 'Уже есть аккаунт?' : 'Еще нет аккаунта?'
);

const switchLinkText = computed(() =>
  isRegister.value ? 'Войти' : 'Зарегистрироваться'
);
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <h2>{{ modalTitle }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <FormInput
            v-model="phone"
            type="tel"
            placeholder="Телефон"
            required
            mask="+7 (###) ###-##-##"
          />
        </div>
        <div class="form-group">
          <FormInput type="password" v-model="password" placeholder="Пароль" required />
        </div>
        <div v-if="isRegister" class="form-group">
          <FormInput type="password" v-model="confirmPassword" placeholder="Подтвердите пароль" required />
        </div>
        <buttonCart type="submit">{{ modalTitle }}</buttonCart>
      </form>
      <p class="switch-text">
        {{ switchText }} 
        <a href="#" @click.prevent="switchModal">{{ switchLinkText }}</a>
      </p>
    </div>
  </div>
</template>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  form button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .switch-text {
  text-align: center;
  margin-top: 10px;
}

.switch-text a {
  color: #0d61af;
  cursor: pointer;
  text-decoration: none;
}

.switch-text a:hover {
  text-decoration: underline;
}
  </style>
  