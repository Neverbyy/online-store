import { createApp } from 'vue';
import './styles/main.scss';
import App from './App.vue';
import store from './store/store';
import router from './router/router';
import VueTheMask from 'vue-the-mask';

createApp(App)
    .use(VueTheMask)
    .use(store)
    .use(router)
    .mount('#app');

if (store.getters['auth/isAuthenticated']) {
    store.dispatch('auth/checkUserExists');
}

store.dispatch('cart/fetchCart');
