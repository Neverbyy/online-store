import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useCartStore } from '../store'

import Home from '../pages/Home.vue'
import CatalogPage from '../pages/CatalogPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import CartPage from '../pages/CartPage.vue'
import OrderPage from '../pages/OrderPage.vue'
import CategoryPage from '../pages/CategoryPage.vue'
import ProductPage from '../pages/ProductPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import FavoritePage from '../pages/FavoritePage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/catalog', name: 'Catalog', component: CatalogPage },
  { path: '/cart', name: 'Cart', component: CartPage },
  {
    path: '/cart/order',
    name: 'Order',
    component: OrderPage,
    meta: { requiresAuth: true, requiresCart: true, showHeader: false },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    beforeEnter: (to, from, next) => {
      // Используем Pinia store
      const authStore = useAuthStore()
      const isAuthenticated = authStore.isAuthenticated
      if (!isAuthenticated) {
        next({ name: 'Home' })
      } else {
        next()
      }
    }
  },
  { path: '/catalog/:category', name: 'Category', component: CategoryPage },
  {
    path: '/catalog/:category/:productName/:productId',
    name: 'ProductPage',
    component: ProductPage,
    props: route => ({
      category: route.params.category,
      productName: route.params.productName,
      productId: route.params.productId
    })
  },
  { path: '/favorites', name: 'Favorites', component: FavoritePage },
  { path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFoundPage,
    meta: { showHeader: false }
   }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ⬇️ ⬇️ ⬇️ ВАЖНО: only после создания router
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiresCart = to.meta.requiresCart
  
  // Используем Pinia stores
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  
  const isAuthenticated = authStore.isAuthenticated
  const cartNotEmpty = cartStore.getCart.length > 0

  if (requiresAuth && !isAuthenticated) {
    window.dispatchEvent(new CustomEvent('open-auth-modal'))
    window.dispatchEvent(new CustomEvent('auth-warning', {
      detail: 'Пожалуйста, авторизуйтесь перед оформлением заказа.',
    }))
    return next({ name: 'Home'})
  }

  if (requiresCart && !cartNotEmpty) {
    return next({ name: 'Cart' })
  }

  next()
})

export default router
