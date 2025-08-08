import { defineStore } from 'pinia'
import axios from 'axios'

export const useMainStore = defineStore('main', {
  state: () => ({
    products: [],
    items: [],
    categoryNames: {
      Computers: 'Компьютеры',
      Smartphones: 'Смартфоны',
      Laptops: 'Ноутбуки',
      Macbooks: 'Макбуки',
      Tablets: 'Планшеты',
      TVs: 'Телевизоры',
      Audio: 'Аудиотехника',
      Cameras: 'Фотоаппараты',
      Consoles: 'Игровые приставки',
      Smartwatches: 'Смарт-часы'
    }
  }),

  getters: {
    getProducts: (state) => state.products,
    getItems: (state) => state.items,
    getCategoryNameById: (state) => (id) => state.categoryNames[id] || id,
    getLimitedProducts: (state) => state.products.slice(0, 6),
    getItemNameById: (state) => (id) => {
      const item = state.items.find(item => item.id === id)
      return item ? item.name : null
    },
    getItemById: (state) => (id) => {
      return state.items.find(item => item.id === id) || null
    },
    getSaleItems: (state) => {
      return state.items.filter(item => item.isSale === true)
    }
  },

  actions: {
    async fetchProducts() {
      try {
        const response = await axios.get('https://48e8b1c201ae4e29.mokky.dev/products')
        this.products = response.data
      } catch (error) {
        console.log('Ошибка:', error)
      }
    },

    async fetchItems() {
      try {
        const response = await axios.get('https://48e8b1c201ae4e29.mokky.dev/items')
        this.items = response.data
      } catch (error) {
        console.log('Ошибка:', error)
      }
    },
    
    async loadProductData(id) {
      try {
        const response = await axios.get(`https://48e8b1c201ae4e29.mokky.dev/items/${id}`)
        const existingItem = this.items.find(i => i.id === response.data.id)
        if (!existingItem) {
          this.items.push(response.data)
        }
      } catch (error) {
        console.error('Error loading product data:', error)
      }
    }
  }
})
