<script setup>
import ProductItem from '../components/ProductItem.vue'
import buttonCart from '../components/UI/buttonCart.vue';
import reviewsList from '../components/reviewsList.vue';
import reviewForm from '../components/reviewForm.vue';
import reviewModal from '../components/reviewModal.vue';
import { computed, watchEffect, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const store = useStore();

const category = computed(() => route.params.category);
const categoryName = computed(() => store.getters.getCategoryNameById(category.value));
const productId = computed(() => Number(route.params.productId));
const product = computed(() => store.getters.getItemById(productId.value));
const reviews = computed(() => store.getters.getReviewsByProductId(productId.value));
const isReviewModalActive = ref(false);
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

const addToCart = (product) => {
  store.dispatch('cart/addToCart', product);
};

const openReviewModal = () => {
  isReviewModalActive.value = true;
};

const closeReviewModal = () => {
  isReviewModalActive.value = false;
};



const loadProductData = async (id) => {
  if (id) {
    await store.dispatch('loadProductData', id);
  }
};

watchEffect(() => {
  loadProductData(productId.value);
});

onMounted(() => {
  store.dispatch('fetchReviews');
});

</script>

<template>
  <div class="product-page">
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link :to="{ name: 'Catalog' }">Каталог</router-link></li>
        <li class="breadcrumb-item"><router-link :to="{ name: 'Category', params: { category } }">{{ categoryName }}</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{ product ? product.name : 'Товар не найден' }}</li>
      </ol>
    </nav>
    <h1 v-if="product">{{ product.name }}</h1>
    <div v-if="product">
      <ProductItem 
        :product="product"
        :addToCart="addToCart"
      />
    </div>
    <h1>Отзывы</h1>
    <div v-if="reviews.length === 0">
      <p>Пока нет отзывов.</p>
    </div>
    <div v-else>
      <reviewsList :reviews="reviews" />
    </div>
    <template v-if="isAuthenticated">
      <buttonCart class="product-btn" @click="openReviewModal">Добавить отзыв </buttonCart>
      <reviewModal :isActive="isReviewModalActive" @close="closeReviewModal">
        <reviewForm :productId="productId" @reviewAdded="closeReviewModal" />
      </reviewModal>
    </template>
    <template v-else>
      <div class="review-auth-hint">Войдите, чтобы оставить отзыв</div>
    </template>
  </div>
</template>


<style lang="scss" scoped>
.product-page{
  padding: 20px;
}
.modal {
  display: none;
}
.product-btn{
  margin-top: 50px;
}
.modal.is-active {
  display: flex;
}
.review-auth-hint {
  margin-top: 40px;
  color: #888;
  font-size: 1.1rem;
  text-align: center;
}
</style>