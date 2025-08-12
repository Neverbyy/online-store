<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore, useAuthStore } from '../store'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import FormInput from '../components/UI/FormInput.vue'
import buttonCart from '../components/UI/buttonCart.vue'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const contact = ref('')
const errorMessage = ref('')

const storeUser = computed(() => profileStore.getUser)

// Сохраняем исходные данные для сравнения
const originalData = ref({
  name: '',
  email: '',
  phone: ''
})

onMounted(() => {
  profileStore.fetchContact().then(() => {
    name.value = storeUser.value.name || ''
    email.value = storeUser.value.email || ''
    contact.value = storeUser.value.phone || ''
    
    // Сохраняем исходные данные
    originalData.value = {
      name: name.value,
      email: email.value,
      phone: contact.value
    }
  })
})

// Проверяем, изменились ли данные
const hasChanges = computed(() => {
  return name.value !== originalData.value.name ||
         email.value !== originalData.value.email ||
         contact.value !== originalData.value.phone
})

// Валидация email (используем ту же логику, что и в FormInput)
const isValidEmail = (email) => {
  if (!email) return true // Email необязателен
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

// Валидация телефона (используем ту же логику, что и в FormInput)
const isValidPhone = (phone) => {
  if (!phone) return false // Телефон обязателен
  return phone.replace(/\D/g, '').length === 11 // Должно быть 11 цифр
}

// Проверяем валидность формы
const isFormValid = computed(() => {
  // Email необязателен, но если заполнен - должен быть валидным
  if (email.value && !isValidEmail(email.value)) {
    return false
  }
  
  // Телефон обязателен и должен быть валидным
  if (!isValidPhone(contact.value)) {
    return false
  }
  
  return true
})

const submitForm = async () => {
  errorMessage.value = ''
  
  // Проверяем валидность формы
  if (!isFormValid.value) {
    // Определяем конкретную ошибку для более точного сообщения
    if (email.value && !isValidEmail(email.value)) {
      ElMessage.error('Пожалуйста, исправьте email адрес')
    } else if (!isValidPhone(contact.value)) {
      ElMessage.error('Пожалуйста, введите корректный номер телефона')
    } else {
      ElMessage.error('Пожалуйста, исправьте ошибки в форме')
    }
    return
  }
  
  // Проверяем, есть ли изменения
  if (!hasChanges.value) {
    ElMessage.primary('Нет изменений для сохранения')
    return
  }
  
  try {
    await profileStore.updateContact({
      phone: contact.value,
      name: name.value,
      email: email.value
    })
    
    // Обновляем исходные данные после успешного сохранения
    originalData.value = {
      name: name.value,
      email: email.value,
      phone: contact.value
    }
    
    ElMessage.success('Изменения сохранены!')
  } catch (e) {
    errorMessage.value = e.message
    ElMessage.error(errorMessage.value)
    errorMessage.value = ''
    contact.value = storeUser.value.phone || ''
  }
}

const resetChanges = () => {
  name.value = originalData.value.name
  email.value = originalData.value.email
  contact.value = originalData.value.phone
  ElMessage.error('Изменения отменены')
}

const logout = async () => {
  await authStore.logoutUser()
  ElMessage.success('Вы успешно вышли из системы')
  router.push('/') // Перенаправление на главную страницу после выхода
}
</script>

<template>
  <form @submit.prevent="submitForm" class="contactform">
    <div class="order-details">
      <FormInput
        v-model="name"
        type="text"
        placeholder="Имя"
      />
      <FormInput
        v-model="email"
        type="email"
        placeholder="Email"
      />
      <FormInput
        v-model="contact"
        type="tel"
        placeholder="Телефон"
        required
        mask="+7 (###) ###-##-##"
      />
      <div class="confirm">
        <buttonCart 
          :class="{ 'has-changes': hasChanges }"
          :disabled="!isFormValid"
        >
          {{ hasChanges ? 'Сохранить изменения' : 'Сохранить' }}
        </buttonCart>
        <buttonCart 
          v-if="hasChanges" 
          @click="resetChanges" 
          type="button" 
          class="reset-button"
        >
          Отменить
        </buttonCart>
      </div>
      <div v-if="validationError" class="validation-error">
        {{ validationError }}
      </div>
    </div>
  </form>
  <buttonCart @click="logout" class="logout-button">Выйти</buttonCart>
</template>

<style lang="scss" scoped>
.confirm {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.logout-button{
  margin-top: 10px;
}

.has-changes {
  background-color: #67c23a !important;
  border-color: #67c23a !important;
  
  &:hover {
    background-color: #85ce61 !important;
    border-color: #85ce61 !important;
  }
}

.reset-button {
  background-color: #909399 !important;
  border-color: #909399 !important;
  
  &:hover {
    background-color: #a6a9ad !important;
    border-color: #a6a9ad !important;
  }
}

.validation-error {
  color: #f56c6c;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
}

// Стили для неактивной кнопки
buttonCart:disabled {
  background-color: #c0c4cc !important;
  border-color: #c0c4cc !important;
  color: #909399 !important;
  cursor: not-allowed !important;
  
  &:hover {
    background-color: #c0c4cc !important;
    border-color: #c0c4cc !important;
  }
}
</style>
