<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import buttonCart from '/src/components/UI/buttonCart.vue'

const store = useStore();
const router = useRouter();

onMounted(() => {
  const orderSuccess = sessionStorage.getItem('orderSuccess');
  if (orderSuccess !== 'true') {
    router.push({ name: 'Home' }); // Перенаправляем на главную страницу, если нет флага успешного заказа
  }
});

// Сбрасываем флаг при уходе со страницы
onBeforeUnmount(() => {
  sessionStorage.removeItem('orderSuccess');
});
</script>

<template>
  <div class="main container">
    <div class="order-success">
        <h1>Заказ оформлен!</h1>
        <img src="/src/assets/success-icon.png" alt="">
        <div class="orderbtn"><router-link to="/"><buttonCart>На главную</buttonCart></router-link></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-success{
    flex-direction: column;
    display: flex;
    justify-content: center;
    padding: 20px;
    gap: 90px;
}

h1{
    text-align: center;
}
img, .orderbtn{
    margin: 0 auto;
}

</style>