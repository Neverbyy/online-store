<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import search from './search.vue';
import AuthModal from './AuthModal.vue';
import { transliterate } from '../helpers/translit';

const store = useStore();
const cart = computed(() => store.getters['cart/getCart']);
const cartLength = computed(() => cart.value.length);

const isModalVisible = ref(false);
const modalType = ref('');

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

const openModal = (type) => {
  modalType.value = type;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const handleAuthSubmit = async (payload) => {
  try {
    if (modalType.value === 'register') {
      await store.dispatch('auth/register', payload);
      closeModal();
      alert('Регистрация успешна! Пожалуйста, войдите.');
      openModal('login'); // Открытие модального окна логина после успешной регистрации
    } else {
      await store.dispatch('auth/login', payload);
      closeModal();
    }
  } catch (error) {
    if (error.message === 'User already exists') {
      alert('Данный пользователь уже существует');
    } else if (error.message === 'Invalid credentials') {
      alert('Неверный телефон или пароль. Попробуйте снова.');
    } else {
      alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
    }
  }
};

const searchText = ref('');
const isSearchFocused = ref(false);

const items = computed(() => store.getters.getItems);
const filteredItems = computed(() => {
  if (searchText.value === '') {
    return [];
  }
  return items.value.filter(item =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const updateSearchText = (newSearchText) => {
  searchText.value = newSearchText;
};

const onSearchFocus = () => {
  isSearchFocused.value = true;
};

const onSearchBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false;
  }, 200);
};

const switchModalType = (type) => {
  modalType.value = type;
};

onMounted(() => {
  store.dispatch('fetchItems');
});
</script>

<template>
  <div class="header">
    <div class="header__inner">
      <router-link to="/">
        <h2>GLANCE</h2>
      </router-link>

      <search 
        @update:searchText="updateSearchText"
        @focus="onSearchFocus"
        @blur="onSearchBlur"
      />

      <div class="header__navbar">
        <ul class="header__navbar-list">
          <router-link to="/catalog">
            <li class="header__navbar-item">
              <img class="header__navbar-image" src="/src/assets/catalog.svg" alt=""><span>Каталог</span>
            </li>
          </router-link>
          
          <router-link to="/cart">
            <li class="header__navbar-item">
              <span :class="['cart-count', {green: cartLength >= 1}]">{{ cartLength  }}</span>
              <img class="header__navbar-image" src="/src/assets/cart.svg" alt=""><span>Корзина</span>
            </li>
          </router-link>

          <template v-if="isAuthenticated">
            <router-link to="/profile">
              <li class="header__navbar-item">
                <img class="header__navbar-image" src="/src/assets/profile.svg" alt=""><span>Профиль</span>
              </li>
            </router-link>
          </template>
          <template v-else>
            <li class="header__navbar-item" @click="openModal('login')">
              <img class="header__navbar-image" src="/src/assets/profile.svg" alt=""><span>Войти</span>
            </li>
          </template>
        </ul>
        <AuthModal 
          v-if="isModalVisible" 
          :visible="isModalVisible" 
          :type="modalType" 
          @close="closeModal" 
          @submit="handleAuthSubmit"
          @switch="switchModalType"
        />
      </div>
    </div>
    <div v-if="filteredItems.length > 0 && isSearchFocused" class="search-results">
      <div v-for="item in filteredItems" :key="item.id" class="search-result-item">
        <img :src="item.image" alt="item.name">
        <router-link :to="`/catalog/${item.category}/${transliterate(item.name)}/${item.id}`">
          <div>{{ item.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: relative;
}

.search-results {
  position: absolute;
  top: 80%;
  left: -65px;
  right: 130px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 1000px;

}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.search-result-item img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.search-result-item:last-child {
  border-bottom: none;
}

.cart-count {
    position: absolute;
    top: 10px;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;

}

.cart-count.green {
  background-color: green;
}
</style>
