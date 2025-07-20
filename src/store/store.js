import { createStore } from "vuex";
import axios from 'axios';
import cartStore from "./cartStore";
import reviewStore from "./reviewStore"
import orderStore from "./orderStore"
import profileStore from "./profileStore";
import authStore from "./authStore"

export default createStore({
    modules: {
        cart: cartStore,
        review: reviewStore,
        order: orderStore,
        profile: profileStore,
        auth: authStore
    },
    
    state: {
        products: [],
        items: [],
        categoryNames: {
            Computers: 'Компьютеры',
            Smartphones: 'Смартфоны',
            Laptops: 'Ноутбуки',
            Macbooks: 'Макбуки'
        }
    },

    getters: {
        getProducts: (state) => state.products,
        getItems: (state) => state.items,
        getCategoryNameById: (state) => (id) => state.categoryNames[id] || id,
        getLimitedProducts: (state) => state.products.slice(0, 6),
        getItemNameById: (state) => (id) => {
            const item = state.items.find(item => item.id === id);
            return item ? item.name : null;
        },
        getItemById: (state) => (id) => {
            return state.items.find(item => item.id === id) || null;
        },
        // Новый getter для получения товаров со скидками
        getSaleItems: (state) => {
            return state.items.filter(item => item.isSale === true);
        }
    },

    mutations: {
        toggleCartNotification(state, value) {
            state.showCartNotification = value;
        },
        setProducts(state, products) {
            state.products = products;
        },
        setItems(state, items) {
            state.items = items;
        },
        addItem(state, item) {
            const existingItem = state.items.find(i => i.id === item.id);
            if (!existingItem) {
                state.items.push(item);
            }
        }
    },

    actions: {
        async fetchProducts({ commit }) {
            try {
                const response = await axios.get('https://48e8b1c201ae4e29.mokky.dev/products');
                commit('setProducts', response.data);
            } catch (error) {
                console.log('Ошибка:', error);
            }
        },

        async fetchItems({ commit }) {
            try {
                const response = await axios.get('https://48e8b1c201ae4e29.mokky.dev/items');
                commit('setItems', response.data);
            } catch (error) {
                console.log('Ошибка:', error);
            }
        },
        
        async loadProductData({ commit }, id) {
            try {
                const response = await axios.get(`https://48e8b1c201ae4e29.mokky.dev/items/${id}`);
                commit('addItem', response.data);
            } catch (error) {
                console.error('Error loading product data:', error);
            }
        }
    }
});
