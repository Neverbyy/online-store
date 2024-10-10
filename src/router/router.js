import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';
import Home from '../pages/Home.vue';
import CatalogPage from '../pages/CatalogPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import CartPage from '../pages/CartPage.vue';
import OrderPage from '../pages/OrderPage.vue';
import OrderSuccessPage from '../pages/OrderSuccessPage.vue';
import CategoryPage from '../pages/CategoryPage.vue';
import ProductPage from '../pages/ProductPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/catalog', name: 'Catalog', component: CatalogPage },
    { path: '/cart', name: 'Cart', component: CartPage },
    { 
        path: '/cart/order', 
        name: 'Order', 
        component: OrderPage, 
        meta: { showHeader: false },
        beforeEnter: (to, from, next) => {
            const store = useStore(); // Получаем доступ к store
            if (store.getters['cart/getCart'].length === 0) {
                next({ name: 'Cart' }); // Перенаправляем на корзину, если она пуста
            } else {
                next(); // Продолжаем переход, если корзина не пуста
            }
        }
    },
    { 
        path: '/cart/order/success', 
        name: 'OrderSuccess', 
        component: OrderSuccessPage
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ProfilePage,
        beforeEnter: (to, from, next) => {
          const store = useStore(); // Получаем доступ к Vuex store
          if (!store.getters['auth/isAuthenticated']) { // Проверяем авторизацию
            next({ name: 'Home' }); // Перенаправляем на главную, если неавторизован
          } else {
            next(); // Разрешаем переход, если авторизован
          }
        }
      },
    { path: '/catalog/:category', name: 'Category', component: CategoryPage },
    { path: '/catalog/:category/:productName/:productId', name: 'ProductPage', component: ProductPage, props: route => ({
        category: route.params.category,
        productName: route.params.productName,
        productId: route.params.productId
    })},
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


export default router;