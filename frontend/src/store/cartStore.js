import { defineStore } from 'pinia'
import axios from 'axios'
import { getApiUrl, API_CONFIG } from '../config/api'

const CART_STORAGE_KEY = 'cart'

const parsePrice = (priceString) => parseFloat(String(priceString).replace(/\s/g, ''))
const calcTotal = (cart) => cart.reduce((acc, item) => acc + (parsePrice(item.price) * item.quantity), 0)

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'),
    totalPrice: 0
  }),

  getters: {
    getCart: (state) => state.cart,
    getTotalPrice: (state) => state.totalPrice,
    formattedTotalPrice: (state) => state.totalPrice.toLocaleString('ru-RU')
  },

  actions: {
    setCart(cart) {
      this.cart = [...cart]
      this.totalPrice = calcTotal(cart)
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    },

    addToCart(item) {
      const existing = this.cart.find(i => i.id === item.id)
      if (existing) {
        if (existing.quantity < 20) existing.quantity += 1
      } else {
        this.cart.push({ ...item, quantity: 1 })
      }
      this.totalPrice = calcTotal(this.cart)
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart))
    },

    removeFromCart(id) {
      this.cart = this.cart.filter(i => i.id !== id)
      this.totalPrice = calcTotal(this.cart)
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart))
    },

    increment(id) {
      const item = this.cart.find(i => i.id === id)
      if (item && item.quantity < 20) item.quantity += 1
      this.totalPrice = calcTotal(this.cart)
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart))
    },

    decrement(id) {
      const item = this.cart.find(i => i.id === id)
      if (item && item.quantity > 1) item.quantity -= 1
      this.totalPrice = calcTotal(this.cart)
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart))
    },

    clearCart() {
      this.cart = []
      this.totalPrice = 0
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]))
    },

    async fetchCart() {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getUser
      const token = authStore.getToken

      if (user && user.id && token) {
        // Серверная корзина
        try {
          const { data } = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CART), {
            params: { userId: user.id },
            headers: { Authorization: `Bearer ${token}` }
          })
          this.setCart(data.cart)
        } catch {
          this.setCart([])
        }
      } else {
        // Локальная корзина
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
        this.setCart(cart)
      }
    },

    async addToCartAsync(product) {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getUser
      const token = authStore.getToken

      if (user && user.id && token) {
        // Сервер
        const existing = this.cart.find(i => i.id === product.id)
        const quantity = existing ? Math.min(existing.quantity + 1, 20) : 1
        try {
          const { data } = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CART), { userId: user.id, product, quantity }, {
            headers: { Authorization: `Bearer ${token}` }
          })
          this.setCart(data.cart)
        } catch {}
      } else {
        // Локально
        this.addToCart(product)
      }
    },

    async removeFromCartAsync(id) {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getUser
      const token = authStore.getToken

      if (user && user.id && token) {
        try {
          const { data } = await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.CART), {
            data: { userId: user.id, productId: id },
            headers: { Authorization: `Bearer ${token}` }
          })
          this.setCart(data.cart)
        } catch {}
      } else {
        this.removeFromCart(id)
      }
    },

    async incrementQuantity(id) {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getUser
      const token = authStore.getToken

      if (user && user.id && token) {
        const item = this.cart.find(i => i.id === id)
        if (item && item.quantity < 20) {
          try {
            const { data } = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CART), { userId: user.id, product: item, quantity: item.quantity + 1 }, {
              headers: { Authorization: `Bearer ${token}` }
            })
            this.setCart(data.cart)
          } catch {}
        }
      } else {
        this.increment(id)
      }
    },

    async decrementQuantity(id) {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getUser
      const token = authStore.getToken

      if (user && user.id && token) {
        const item = this.cart.find(i => i.id === id)
        if (item && item.quantity > 1) {
          try {
            const { data } = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CART), { userId: user.id, product: item, quantity: item.quantity - 1 }, {
              headers: { Authorization: `Bearer ${token}` }
            })
            this.setCart(data.cart)
          } catch {}
        }
      } else {
        this.decrement(id)
      }
    },

    async clearCartAsync() {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getUser
      const token = authStore.getToken

      if (user && user.id && token) {
        try {
          const { data } = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CART_CLEAR), { userId: user.id }, {
            headers: { Authorization: `Bearer ${token}` }
          })
          this.setCart(data.cart)
        } catch {
          this.setCart([])
        }
      } else {
        this.clearCart()
      }
      // Всегда очищаем localStorage для предотвращения утечек между пользователями
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]))
    }
  }
})
