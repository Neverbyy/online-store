<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore, useFavoriteStore, useAuthStore, useMainStore } from '../store'
import { ElMessage } from 'element-plus'
import search from './search.vue'
import AuthModal from './AuthModal.vue'
import { transliterate } from '../helpers/translit'
import { getImageUrl } from '../utils/imageUtils'

const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()
const mainStore = useMainStore()

const cart = computed(() => cartStore.getCart)
const cartLength = computed(() => cart.value.length)
const favoriteLength = computed(() => favoriteStore.getFavorites.length)

const isModalVisible = ref(false)
const modalType = ref('')
const authMessage = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated)

const openModal = (type) => {
  modalType.value = type
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
  authMessage.value = ''
}

const handleAuthSubmit = async (payload) => {
  try {
    if (modalType.value === 'register') {
      await authStore.register(payload)
      // Уведомление о регистрации показывается в AuthModal.vue
    } else {
      await authStore.loginUser(payload)
      // Уведомление о входе показывается в handleModalClose
    }
  } catch (error) {
    // Ошибки обрабатываются в AuthModal.vue
    console.error('Ошибка в handleAuthSubmit:', error)
  }
}

const handleAuthWarning = (event) => {
  authMessage.value = event.detail
  showLoginModal()
}

const searchText = ref('')
const isSearchFocused = ref(false)

const items = computed(() => mainStore.getItems)
const filteredItems = computed(() => {
  if (searchText.value === '') {
    return []
  }
  return items.value.filter(item =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

const updateSearchText = (newSearchText) => {
  searchText.value = newSearchText
}

const onSearchFocus = () => {
  isSearchFocused.value = true
}

const onSearchBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false
  }, 200)
}

const switchModalType = (type) => {
  modalType.value = type
}

const handleModalClose = () => {
  closeModal()
  if (authStore.isAuthenticated) {
    ElMessage.success('Вход выполнен успешно!')
  }
}

onMounted(() => {
  window.addEventListener('open-auth-modal', showLoginModal)
  window.addEventListener('auth-warning', handleAuthWarning)
  mainStore.fetchItems()
  if (authStore.isAuthenticated) {
    favoriteStore.fetchFavorites()
  }
})

const showLoginModal = () => {
  openModal('login')
}
</script>

<template>
  <div class="header">
    <div class="header__inner">
      <router-link to="/">
        <h1>GLANCE</h1>
      </router-link>

      <search @update:searchText="updateSearchText" @focus="onSearchFocus" @blur="onSearchBlur" />

      <div class="header__navbar">
        <ul class="header__navbar-list">
          <router-link to="/catalog">
            <li class="header__navbar-item">
              <svg class="header__navbar-image" width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" width="2" height="2" rx="1" fill="#454545"/>
                <rect x="6.5" width="20" height="2" rx="1" fill="#454545"/>
                <rect x="0.5" y="8" width="2" height="2" rx="1" fill="#454545"/>
                <rect x="6.5" y="8" width="20" height="2" rx="1" fill="#454545"/>
                <rect x="0.5" y="16" width="2" height="2" rx="1" fill="#454545"/>
                <rect x="6.5" y="16" width="20" height="2" rx="1" fill="#454545"/>
              </svg>
              <span>Каталог</span>
            </li>
          </router-link>

          <router-link to="/favorites">
            <li class="header__navbar-item">
              <span :class="['favorite-count', { green: favoriteLength >= 1 }]">{{ favoriteLength }}</span>
              <svg class="header__navbar-image" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.612 2.82611C17.1722 2.40569 16.65 2.07219 16.0752 1.84465C15.5005 1.61711 14.8844 1.5 14.2623 1.5C13.6401 1.5 13.0241 1.61711 12.4493 1.84465C11.8746 2.07219 11.3524 2.40569 10.9126 2.82611L9.99977 3.69821L9.08699 2.82611C8.19858 1.9773 6.99364 1.50044 5.73725 1.50044C4.48085 1.50044 3.27591 1.9773 2.38751 2.82611C1.4991 3.67492 1 4.82616 1 6.02656C1 7.22696 1.4991 8.37819 2.38751 9.227L3.30029 10.0991L9.99977 16.5L16.6992 10.0991L17.612 9.227C18.0521 8.80679 18.4011 8.30785 18.6393 7.75871C18.8774 7.20957 19 6.62097 19 6.02656C19 5.43214 18.8774 4.84355 18.6393 4.2944C18.4011 3.74526 18.0521 3.24633 17.612 2.82611Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Избранное</span>
            </li>
          </router-link>
          
          <router-link to="/cart">
            <li class="header__navbar-item">
              <span :class="['cart-count', { green: cartLength >= 1 }]">{{ cartLength }}</span>
              <svg class="header__navbar-image" width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 22C10.0523 22 10.5 21.5523 10.5 21C10.5 20.4477 10.0523 20 9.5 20C8.94772 20 8.5 20.4477 8.5 21C8.5 21.5523 8.94772 22 9.5 22Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19.5 22C20.0523 22 20.5 21.5523 20.5 21C20.5 20.4477 20.0523 20 19.5 20C18.9477 20 18.5 20.4477 18.5 21C18.5 21.5523 18.9477 22 19.5 22Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1.5 1H5.5L8.18 15.2823C8.27144 15.7734 8.52191 16.2145 8.88755 16.5285C9.25318 16.8424 9.7107 17.0092 10.18 16.9996H19.9C20.3693 17.0092 20.8268 16.8424 21.1925 16.5285C21.5581 16.2145 21.8086 15.7734 21.9 15.2823L23.5 6.3332H6.5" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Корзина</span>
            </li>
          </router-link>

          <template v-if="isAuthenticated">
            <router-link to="/profile">
              <li class="header__navbar-item">
                <svg class="header__navbar-image" width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 23V20.6667C21 19.429 20.4732 18.242 19.5355 17.3668C18.5979 16.4917 17.3261 16 16 16H6C4.67392 16 3.40215 16.4917 2.46447 17.3668C1.52678 18.242 1 19.429 1 20.6667V23" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.5 11C13.2614 11 15.5 8.76142 15.5 6C15.5 3.23858 13.2614 1 10.5 1C7.73858 1 5.5 3.23858 5.5 6C5.5 8.76142 7.73858 11 10.5 11Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Профиль</span>
              </li>
            </router-link>
          </template>
          <template v-else>
            <li class="header__navbar-item" @click="openModal('login')">
              <svg class="header__navbar-image" width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 23V20.6667C21 19.429 20.4732 18.242 19.5355 17.3668C18.5979 16.4917 17.3261 16 16 16H6C4.67392 16 3.40215 16.4917 2.46447 17.3668C1.52678 18.242 1 19.429 1 20.6667V23" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.5 11C13.2614 11 15.5 8.76142 15.5 6C15.5 3.23858 13.2614 1 10.5 1C7.73858 1 5.5 3.23858 5.5 6C5.5 8.76142 7.73858 11 10.5 11Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Войти</span>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div v-if="filteredItems.length > 0 && isSearchFocused" class="search-results">
      <div v-for="item in filteredItems" :key="item.id" class="search-result-item">
        <img :src="getImageUrl(item.image)" alt="item.name">
        <router-link :to="`/catalog/${item.category}/${transliterate(item.name)}/${item.id}`">
          <div>{{ item.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
  <nav class="mobile-navbar">
    <router-link to="/favorites" class="mobile-navbar__item" active-class="active">
      <span :class="['mobile-favorite-count', { green: favoriteLength >= 1 }]">{{ favoriteLength }}</span>
      <svg class="mobile-navbar__icon" width="24" height="22" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.612 2.82611C17.1722 2.40569 16.65 2.07219 16.0752 1.84465C15.5005 1.61711 14.8844 1.5 14.2623 1.5C13.6401 1.5 13.0241 1.61711 12.4493 1.84465C11.8746 2.07219 11.3524 2.40569 10.9126 2.82611L9.99977 3.69821L9.08699 2.82611C8.19858 1.9773 6.99364 1.50044 5.73725 1.50044C4.48085 1.50044 3.27591 1.9773 2.38751 2.82611C1.4991 3.67492 1 4.82616 1 6.02656C1 7.22696 1.4991 8.37819 2.38751 9.227L3.30029 10.0991L9.99977 16.5L16.6992 10.0991L17.612 9.227C18.0521 8.80679 18.4011 8.30785 18.6393 7.75871C18.8774 7.20957 19 6.62097 19 6.02656C19 5.43214 18.8774 4.84355 18.6393 4.2944C18.4011 3.74526 18.0521 3.24633 17.612 2.82611Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Избранное</span>
    </router-link>
    <router-link to="/catalog" class="mobile-navbar__item" active-class="active">
      <svg class="mobile-navbar__icon" width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" width="2" height="2" rx="1" fill="#454545"/>
        <rect x="6.5" width="20" height="2" rx="1" fill="#454545"/>
        <rect x="0.5" y="8" width="2" height="2" rx="1" fill="#454545"/>
        <rect x="6.5" y="8" width="20" height="2" rx="1" fill="#454545"/>
        <rect x="0.5" y="16" width="2" height="2" rx="1" fill="#454545"/>
        <rect x="6.5" y="16" width="20" height="2" rx="1" fill="#454545"/>
      </svg>
      <span>Каталог</span>
    </router-link>
    <router-link to="/cart" class="mobile-navbar__item" active-class="active">
      <span :class="['mobile-cart-count', { green: cartLength >= 1 }]">{{ cartLength }}</span>
      <svg class="mobile-navbar__icon" width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 22C10.0523 22 10.5 21.5523 10.5 21C10.5 20.4477 10.0523 20 9.5 20C8.94772 20 8.5 20.4477 8.5 21C8.5 21.5523 8.94772 22 9.5 22Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19.5 22C20.0523 22 20.5 21.5523 20.5 21C20.5 20.4477 20.0523 20 19.5 20C18.9477 20 18.5 20.4477 18.5 21C18.5 21.5523 18.9477 22 19.5 22Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.5 1H5.5L8.18 15.2823C8.27144 15.7734 8.52191 16.2145 8.88755 16.5285C9.25318 16.8424 9.7107 17.0092 10.18 16.9996H19.9C20.3693 17.0092 20.8268 16.8424 21.1925 16.5285C21.5581 16.2145 21.8086 15.7734 21.9 15.2823L23.5 6.3332H6.5" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Корзина</span>
    </router-link>
    <router-link v-if="isAuthenticated" to="/profile" class="mobile-navbar__item" active-class="active">
      <svg class="mobile-navbar__icon" width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 23V20.6667C21 19.429 20.4732 18.242 19.5355 17.3668C18.5979 16.4917 17.3261 16 16 16H6C4.67392 16 3.40215 16.4917 2.46447 17.3668C1.52678 18.242 1 19.429 1 20.6667V23" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.5 11C13.2614 11 15.5 8.76142 15.5 6C15.5 3.23858 13.2614 1 10.5 1C7.73858 1 5.5 3.23858 5.5 6C5.5 8.76142 7.73858 11 10.5 11Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Профиль</span>
    </router-link>
    <button v-else class="mobile-navbar__item" @click="openModal('login')" type="button">
      <svg class="mobile-navbar__icon" width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 23V20.6667C21 19.429 20.4732 18.242 19.5355 17.3668C18.5979 16.4917 17.3261 16 16 16H6C4.67392 16 3.40215 16.4917 2.46447 17.3668C1.52678 18.242 1 19.429 1 20.6667V23" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.5 11C13.2614 11 15.5 8.76142 15.5 6C15.5 3.23858 13.2614 1 10.5 1C7.73858 1 5.5 3.23858 5.5 6C5.5 8.76142 7.73858 11 10.5 11Z" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Войти</span>
    </button>
  </nav>
  
  <!-- Модальное окно авторизации -->
  <AuthModal 
    v-if="isModalVisible" 
    :visible="isModalVisible" 
    :type="modalType" 
    :message="authMessage" 
    @close="handleModalClose"
    @submit="handleAuthSubmit" 
    @switch="switchModalType" 
  />
</template>

<style lang="scss" scoped>
.header {
  position: relative;
}

.search-results {
  position: absolute;
  top: 80%;
  z-index: 500;
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

.favorite-count {
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
.favorite-count.green {
  background-color: green;
}

.mobile-navbar {
  display: none;
}

@media (max-width: 900px) {
  .header {
    padding: 20px 16px 20px;
    border: none;
  }
  
  .header__navbar {
    display: none !important;
  }
  
  .search-results {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    width: 100vw;
    max-width: none;
    margin: 0;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    z-index: 1200;
    max-height: 50vh;
    overflow-y: auto;
    padding: 0 0 8px 0;
  }
  
  .search-result-item {
    padding: 12px 16px;
  }
  
  .search-result-item img {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }
  
  .mobile-navbar {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 70px;
    background: #fff;
    box-shadow: 0 -3px 12px rgba(0,0,0,0.08);
    z-index: 1000;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #e0e0e0;
  }
  
  .mobile-navbar__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #454545;
    font-size: 15px;
    text-decoration: none;
    cursor: pointer;
    height: 100%;
    width: 25%;
    transition: color 0.2s;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
  }
  
  .mobile-navbar__icon {
    margin-bottom: 4px;
    display: block;
  }
  
  .mobile-navbar__item.active,
  .mobile-navbar__item.router-link-exact-active {
    color: #750DC5;
  }
  
  .mobile-favorite-count, .mobile-cart-count {
    position: absolute;
    top: 6px;
    left: 62%;
    transform: translateX(-50%);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background-color: #bdbdbd;
    z-index: 2;
  }
  
  .mobile-cart-count.green, .mobile-favorite-count.green {
    background-color: green;
  }
}

// Дополнительные стили для средних планшетов
@media (max-width: 768px) and (min-width: 601px) {
  .header {
    padding: 18px 12px 18px;
  }
  
  .search-result-item {
    padding: 10px 14px;
  }
  
  .search-result-item img {
    width: 38px;
    height: 38px;
    margin-right: 10px;
  }
  
  .mobile-navbar {
    height: 68px;
  }
  
  .mobile-navbar__item {
    font-size: 14px;
  }
  
  .mobile-navbar__icon {
    margin-bottom: 3px;
  }
  
  .mobile-favorite-count, .mobile-cart-count {
    width: 19px;
    height: 19px;
    font-size: 11px;
  }
}
</style>
