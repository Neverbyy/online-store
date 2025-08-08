import { createApp } from 'vue'
import './styles/main.scss'
import App from './App.vue'
import pinia from './store'
import router from './router/router'
import VueTheMask from 'vue-the-mask'

const app = createApp(App)

app.use(VueTheMask)
app.use(pinia)
app.use(router)
app.mount('#app')

// Инициализация после монтирования приложения
import { useAuthStore } from './store'
import { useCartStore } from './store'

const authStore = useAuthStore()
const cartStore = useCartStore()

if (authStore.isAuthenticated) {
    authStore.checkUserExists()
}

cartStore.fetchCart()
