<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import FormInput from '../components/UI/FormInput.vue';
import buttonCart from '../components/UI/buttonCart.vue';

const store = useStore();
const router = useRouter();

const contact = computed({
  get: () => store.getters['profile/getContact'],
  set: (value) => store.dispatch('profile/updateContact', value),
});

const submitForm = () => {
  // Логика для сохранения изменений профиля
  store.dispatch('profile/updateContact', contact.value);
  alert('Изменения сохранены!');
};

const logout = async () => {
  await store.dispatch('auth/logout');
  router.push('/'); // Перенаправление на главную страницу после выхода
};

onMounted(() => {
  store.dispatch('profile/fetchContact');
});
</script>

<template>
  <form @submit.prevent="submitForm" class="contactform">
    <div class="order-details">
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
</style>
