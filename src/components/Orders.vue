<template>
  <div class="orders-history">
    <h2 class="orders-title">История заказов</h2>
    <div v-if="orders.length === 0" class="orders-empty">У вас пока нет заказов.</div>
    <div v-else class="orders-list">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
        @click="openOrderModal(order)"
        style="cursor:pointer;"
      >
        <div class="order-header">
          <span class="order-date">{{ order.date }}</span>
          <span class="order-status" :class="order.status === 'Оформлен' ? 'status-success' : 'status-other'">{{ order.status }}</span>
        </div>
        <div class="order-info">
          <div class="order-row">
            <span class="order-label">Сумма:</span>
            <span class="order-value order-sum">{{ formatPrice(order.totalPrice) }} ₽</span>
          </div>
          <div class="order-row">
            <span class="order-label">Доставка:</span>
            <span class="order-value">{{ order.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Курьер' }}</span>
          </div>
          <div v-if="order.deliveryMethod === 'courier' && order.address" class="order-row">
            <span class="order-label">Адрес:</span>
            <span class="order-value">{{ order.address.city }}, {{ order.address.street }}, д.{{ order.address.home }}, кв.{{ order.address.flat }}</span>
          </div>
        </div>
        <div class="order-products">
          <span class="order-label">Товары:</span>
          <ul class="order-items">
            <li v-for="item in order.items" :key="item.id" class="order-item">
              <span class="item-dot"></span>
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">×{{ item.quantity }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <OrderDetailsModal
      v-if="isModalOpen && selectedOrder"
      :order="selectedOrder"
      :onClose="closeOrderModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import OrderDetailsModal from './OrderDetailsModal.vue';

const store = useStore();
const orders = ref([]);

const formatPrice = price => Number(price).toLocaleString('ru-RU');

const selectedOrder = ref(null);
const isModalOpen = ref(false);

const openOrderModal = order => {
  selectedOrder.value = order;
  isModalOpen.value = true;
};
const closeOrderModal = () => {
  isModalOpen.value = false;
  selectedOrder.value = null;
};

const loadOrders = async () => {
  const user = store.getters['profile/getUser'] || {};
  let url = 'http://localhost:5000/api/orders';
  if (user.id) {
    url += `?userId=${user.id}`;
  } else if (user.phone) {
    url += `?userPhone=${encodeURIComponent(user.phone)}`;
  } else {
    orders.value = [];
    return;
  }
  try {
    const res = await axios.get(url);
    orders.value = res.data.orders || [];
  } catch (e) {
    orders.value = [];
  }
};

onMounted(() => {
  loadOrders();
});
</script>

<style lang="scss" scoped>
.orders-history {
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 16px 0 16px;
}

.orders-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
  letter-spacing: 0.5px;
}

.orders-empty {
  text-align: center;
  color: #888;
  font-size: 1.1rem;
  margin-top: 40px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 6px;
}

// Стилизация скроллбара для Webkit (Chrome, Edge, Safari)
.orders-list::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}
.orders-list::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 6px;
}
.orders-list::-webkit-scrollbar-thumb:hover {
  background: #c0c0c0;
}

// Firefox
.orders-list {
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 #fff;
}

.order-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(80, 80, 120, 0.08);
  padding: 24px 20px 18px 20px;
  transition: box-shadow 0.2s;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  &:hover {
    box-shadow: 0 4px 24px 0 rgba(80, 80, 120, 0.16);
    border-color: #e0e0e0;
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-date {
  color: #888;
  font-size: 0.98rem;
}

.order-status {
  font-size: 0.98rem;
  font-weight: 600;
  padding: 2px 12px;
  border-radius: 12px;
  &.status-success {
    background: #e6fbe6;
    color: #1a9b1a;
    border: 1px solid #b6e6b6;
  }
  &.status-other {
    background: #fbeee6;
    color: #b97a1a;
    border: 1px solid #f5d6b6;
  }
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-row {
  display: flex;
  gap: 8px;
  font-size: 1rem;
  align-items: center;
}

.order-label {
  color: #888;
  min-width: 80px;
  font-size: 0.97rem;
}

.order-value {
  font-weight: 500;
  color: #222;
}

.order-sum {
  color: #750DC5;
  font-size: 1.1rem;
  font-weight: 700;
}

.order-products {
  margin-top: 10px;
}

.order-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.98rem;
  color: #444;
}

.item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #750DC5;
  display: inline-block;
  margin-right: 4px;
}

.item-name {
  flex: 1 1 auto;
}

.item-qty {
  color: #888;
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .orders-history {
    padding: 16px 2vw 0 2vw;
  }
  .order-card {
    padding: 14px 8px 12px 8px;
  }
  .orders-title {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }
  .orders-list {
    max-height: 70vh;
  }
}
</style>