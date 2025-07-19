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


store.dispatch('cart/loadCart');
