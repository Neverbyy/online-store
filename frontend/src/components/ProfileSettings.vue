<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore, useAuthStore } from '../store'
import { useRouter } from 'vue-router'
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
const storeName = computed(() => profileStore.getName)
const storeEmail = computed(() => profileStore.getEmail)
const storeContact = computed(() => profileStore.getContact)

onMounted(() => {
  profileStore.fetchContact().then(() => {
    name.value = storeUser.value.name || ''
    email.value = storeUser.value.email || ''
    contact.value = storeUser.value.phone || ''
  })
})

const submitForm = async () => {
  errorMessage.value = ''
  try {
    await profileStore.updateContact({
      phone: contact.value,
      name: name.value,
      email: email.value
    })
    alert('Изменения сохранены!')
  } catch (e) {
    errorMessage.value = e.message
    alert(errorMessage.value)
    errorMessage.value = ''
    contact.value = storeUser.value.phone || ''
  }
}

const logout = async () => {
  await authStore.logoutUser()
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
        <buttonCart>Сохранить</buttonCart>
      </div>
    </div>
  </form>
  <buttonCart @click="logout" class="logout-button">Выйти</buttonCart>
</template>

<style lang="scss" scoped>
.confirm {
  margin-top: 20px;
}
.logout-button{
  margin-top: 10px;
}
</style>
