<template>
  <div class="favorites-page">
    <div class="favorites-header">
      <h1>Избранное</h1>
    </div>
    <div v-if="favorites.length === 0" class="favorites-empty">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_518_90)">
          <rect x="19" y="19" width="40" height="40" rx="12" fill="#F6F6F6"/>
          <path d="M46.612 32.8261C46.1722 32.4057 45.65 32.0722 45.0752 31.8447C44.5005 31.6171 43.8844 31.5 43.2623 31.5C42.6401 31.5 42.0241 31.6171 41.4493 31.8447C40.8746 32.0722 40.3524 32.4057 39.9126 32.8261L38.9998 33.6982L38.087 32.8261C37.1986 31.9773 35.9936 31.5004 34.7372 31.5004C33.4809 31.5004 32.2759 31.9773 31.3875 32.8261C30.4991 33.6749 30 34.8262 30 36.0266C30 37.227 30.4991 38.3782 31.3875 39.227L32.3003 40.0991L38.9998 46.5L45.6992 40.0991L46.612 39.227C47.0521 38.8068 47.4011 38.3079 47.6393 37.7587C47.8774 37.2096 48 36.621 48 36.0266C48 35.4321 47.8774 34.8435 47.6393 34.2944C47.4011 33.7453 47.0521 33.2463 46.612 32.8261Z" fill="#E0E0E0" stroke="#BDBDBD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>
      <div class="favorites-empty-title">В избранном пока пусто</div>
      <div class="favorites-empty-desc">Добавляйте товары в избранное, чтобы быстро находить их позже.</div>
      <router-link to="/catalog" class="favorites-empty-btn">Перейти в каталог</router-link>
    </div>
    <div v-else class="favorites-list">
      <saleItem
        v-for="product in favorites"
        :key="product.id"
        :product="product"
        :addToCart="() => store.dispatch('cart/addToCart', product)"
        class="favorite-card"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import saleItem from '../components/saleItem.vue';

const store = useStore();
const favorites = computed(() => store.getters['favorite/getFavorites']);

onMounted(() => {
  store.dispatch('favorite/fetchFavorites');
});
</script>

<style lang="scss" scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px 48px 16px;
  min-height: 70vh;
}

.favorites-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 32px;
  h1 {
    font-size: 2.2rem;
    font-weight: 700;
    color: #222;
    margin: 0;
    letter-spacing: 1px;
  }
  svg {
    display: block;
  }
}

.favorites-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 350px;
  background: #faf9fd;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(117,13,197,0.06);
  padding: 48px 24px 40px 24px;
  margin-top: 32px;
  svg {
    margin-bottom: 18px;
  }
}
.favorites-empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #750DC5;
  margin-bottom: 8px;
}
.favorites-empty-desc {
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 24px;
}
.favorites-empty-btn {
  display: inline-block;
  background: #750DC5;
  color: #fff;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px 0 rgba(117,13,197,0.08);
  transition: background 0.2s;
  &:hover {
    background: #5d0aa1;
  }
}

.favorites-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px 32px;
  margin-top: 12px;
  width: 100%;
}

.favorite-card {
  width: 320px;
  min-height: 420px;
  flex: 0 1 320px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 16px 0 rgba(117,13,197,0.10);
  border-radius: 16px;
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;
  padding-bottom: 8px;
  &:hover {
    box-shadow: 0 6px 32px 0 rgba(117,13,197,0.18);
    transform: translateY(-4px) scale(1.02);
  }
}

@media (max-width: 900px) {
  .favorites-page {
    padding: 24px 12px 100px 12px;
  }
  
  .favorites-header {
    margin-bottom: 24px;
    h1 {
      font-size: 1.8rem;
    }
  }
  
  .favorites-list {
    gap: 20px;
  }
  
  .favorite-card {
    width: 280px;
    min-height: 380px;
    flex: 0 1 280px;
  }
  
  .favorites-empty {
    padding: 32px 16px 24px 16px;
    margin-top: 24px;
  }
  
  .favorites-empty-title {
    font-size: 1.3rem;
  }
  
  .favorites-empty-desc {
    font-size: 1rem;
  }
  
  .main {
    padding-bottom: 80px;
  }
}

@media (max-width: 600px) {
  .favorites-page {
    padding: 16px 8px 100px 8px;
  }
  
  .favorites-header {
    margin-bottom: 20px;
    h1 {
      font-size: 1.5rem;
    }
  }
  
  .favorites-list {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  
  .favorite-card {
    width: 100%;
    max-width: 320px;
    min-height: auto;
    flex: none;
  }
  
  .favorites-empty {
    padding: 24px 12px 20px 12px;
    margin-top: 20px;
  }
  
  .favorites-empty-title {
    font-size: 1.2rem;
  }
  
  .favorites-empty-desc {
    font-size: 0.9rem;
    text-align: center;
  }
  
  .favorites-empty-btn {
    padding: 10px 24px;
    font-size: 1rem;
  }
}
</style>