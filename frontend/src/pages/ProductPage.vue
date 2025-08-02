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
      />
    </div>
    <div class="reviews-section">
      <h1>Отзывы</h1>
      <div v-if="reviews.length === 0">
        <p>Пока нет отзывов.</p>
      </div>
      <div v-else>
        <reviewsList :reviews="reviews" />
      </div>
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
  
  @media (max-width: 600px) {
    padding: 0 0 90px 0;
  }
}
.modal {
  display: none;
}
.product-btn{
  margin-top: 50px;
  
  @media (max-width: 600px) {
    margin: 30px 16px;
    width: calc(100% - 32px);
  }
}
.modal.is-active {
  display: flex;
}
.review-auth-hint {
  margin-top: 40px;
  color: #888;
  font-size: 1.1rem;
  text-align: center;
  
  @media (max-width: 600px) {
    margin-top: 30px;
    padding: 0 16px;
    font-size: 1rem;
  }
}

/* Стили для хлебных крошек на мобильных */
@media (max-width: 600px) {
  .breadcrumb {
    padding: 16px;
    margin: 0;
    font-size: 14px;
  }
  
  .breadcrumb-item {
    margin-right: 8px;
    font-size: 14px;
  }
  
  
  h1 {
    padding: 0 16px;
    margin: 20px 0;
    font-size: 24px;
    line-height: 1.3;
  }
  
  /* Стили для секции отзывов на мобильных */
  .reviews-section {
    padding: 0;
    margin-top: 30px;
  }
  
  .reviews-section h1 {
    padding: 0 16px;
    margin-bottom: 20px;
  }
  
  .reviews-section p {
    padding: 0;
    margin: 20px 0;
    text-align: center;
    color: #666;
  }
}
</style>