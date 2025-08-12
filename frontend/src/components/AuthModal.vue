<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../store'
import { ElMessage } from 'element-plus'
import FormInput from './UI/FormInput.vue'
import buttonCart from '/src/components/UI/buttonCart.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  }
})

const emit = defineEmits(['close', 'submit', 'switch'])
const authStore = useAuthStore()

const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const isRegister = computed(() => props.type === 'register')
const modalTitle = computed(() => (isRegister.value ? 'Регистрация' : 'Войти'))

const handleSubmit = async () => {
  // Предотвращаем множественные клики
  if (loading.value) return
  
  // Валидация номера телефона
  const phoneDigits = phone.value.replace(/\D/g, '')
  if (phoneDigits.length !== 11) {
    ElMessage.error('Номер телефона должен состоять из 11 цифр')
    return
  }
  
  // Валидация пароля для регистрации
  if (isRegister.value) {
    
    if (password.value !== confirmPassword.value) {
      ElMessage.error('Пароли не совпадают!')
      return
    }
  } else {
    // Валидация для входа в систему
    if (!password.value.trim()) {
      ElMessage.error('Введите пароль')
      return
    }
  }

  loading.value = true
  
  try {
    const payload = {
      phone: phone.value,
      password: password.value,
    }

    if (isRegister.value) {
      const success = await authStore.register(payload)
      if (success) {
        ElMessage.success('Регистрация успешна! Теперь войдите в систему.')
        emit('switch', 'login')
      }
    } else {
      const success = await authStore.loginUser(payload)
      if (success) {
        emit('close') // Закрываем модальное окно только при успешном входе
      }
    }
  } catch (error) {
    console.error('Ошибка при авторизации:', error)
    
    // Обработка различных типов ошибок
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 409) {
        // Конфликт - пользователь уже существует
        ElMessage.error('Пользователь с таким номером уже существует')
      } else if (status === 401) {
        // Неавторизован - неверные данные
        ElMessage.error('Неверный номер телефона или пароль')
      } else if (status === 404) {
        // Пользователь не найден
        ElMessage.error('Пользователь не найден')
      } else if (status === 400) {
        // Неверный запрос
        if (data && data.message) {
          ElMessage.error(data.message)
        } else {
          ElMessage.error('Неверные данные. Проверьте правильность ввода')
        }
      } else if (status === 422) {
        // Ошибка валидации
        if (data && data.message) {
          ElMessage.error(data.message)
        } else {
          ElMessage.error('Ошибка валидации данных')
        }
      } else if (status >= 500) {
        // Ошибка сервера
        ElMessage.error('Ошибка сервера. Попробуйте позже')
      } else {
        // Другие ошибки
        ElMessage.error('Произошла ошибка. Попробуйте снова')
      }
    } else if (error.request) {
      // Ошибка сети
      ElMessage.error('Ошибка сети. Проверьте подключение к интернету')
    } else {
      // Другие ошибки
      ElMessage.error('Произошла ошибка. Попробуйте снова')
    }
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
}

const switchModal = () => {
  emit('switch', isRegister.value ? 'login' : 'register')
}

const switchText = computed(() =>
  isRegister.value ? 'Уже есть аккаунт?' : 'Еще нет аккаунта?'
)

const switchLinkText = computed(() =>
  isRegister.value ? 'Войти' : 'Зарегистрироваться'
)
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <h2>{{ modalTitle }}</h2>

      <div v-if="props.message" class="auth-warning">
        {{ props.message }}
      </div>

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
        <buttonCart type="submit" :disabled="loading">
          {{ loading ? 'Загрузка...' : modalTitle }}
        </buttonCart>
      </form>
      <p class="switch-text">
        {{ switchText }} 
        <a href="#" @click.prevent="switchModal">{{ switchLinkText }}</a>
      </p>
    </div>
  </div>
</template>
  
  <style scoped>
  .auth-warning {
    background-color: #ffe5e5;
    color: #c00;
    padding: 10px;
    border: 1px solid #c00;
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 14px;
    text-align: center;
  }
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
    z-index: 2000;
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

  /* Мобильные стили */
  @media (max-width: 768px) {
    .modal-content {
      margin: 20px;
      max-width: calc(100% - 40px);
      max-height: calc(100vh - 40px);
      overflow-y: auto;
    }
    
    .modal-overlay {
      padding: 10px;
    }
    
    .close-button {
      top: 15px;
      right: 15px;
      font-size: 24px;
      padding: 5px;
    }
    
    h2 {
      margin-top: 10px;
      margin-bottom: 20px;
      font-size: 20px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
  }
  </style>
  