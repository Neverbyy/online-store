<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import FormInput from '../components/UI/FormInput.vue';
import buttonCart from '../components/UI/buttonCart.vue';

const store = useStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const contact = ref('');
const errorMessage = ref('');

const storeUser = computed(() => store.getters['profile/getUser']);
const storeName = computed(() => store.getters['profile/getName']);
const storeEmail = computed(() => store.getters['profile/getEmail']);
const storeContact = computed(() => store.getters['profile/getContact']);

onMounted(() => {
  store.dispatch('profile/fetchContact').then(() => {
    name.value = storeUser.value.name || '';
    email.value = storeUser.value.email || '';
    contact.value = storeUser.value.phone || '';
  });
});

const submitForm = async () => {
  errorMessage.value = '';
  try {
    await store.dispatch('profile/updateContact', {
      phone: contact.value,
      name: name.value,
      email: email.value
    });
    alert('Изменения сохранены!');
  } catch (e) {
    errorMessage.value = e.message;
    alert(errorMessage.value);
    errorMessage.value = '';
    contact.value = storeUser.value.phone || '';
  }
};

const logout = async () => {
  await store.dispatch('auth/logout');
  router.push('/'); // Перенаправление на главную страницу после выхода
};

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
