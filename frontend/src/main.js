import { createApp } from 'vue'
import './styles/main.scss'
import App from './App.vue'
import pinia from './store'
import router from './router/router'
import VueTheMask from 'vue-the-mask'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

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

// Проверка валидности токена при старте
if (!authStore.isTokenValid) {
    authStore.logout()
}

if (authStore.isAuthenticated) {
    authStore.checkUserExists()
}

cartStore.fetchCart()
