<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-window">
      <button class="modal-close" @click="handleClose" aria-label="Закрыть">×</button>
      <h3 class="modal-title">Детали заказа</h3>
      <div class="modal-section section-main">
        <div class="modal-row">
          <span class="modal-label">Дата:</span>
          <span class="modal-value">{{ order.date }}</span>
        </div>
        <div class="modal-row">
          <span class="modal-label">Статус:</span>
          <span class="modal-value">
            <span :class="order.status === 'Оформлен' ? 'status-success' : 'status-other'">
              <span class="status-dot" :class="order.status === 'Оформлен' ? 'dot-success' : 'dot-other'"></span>
              {{ order.status }}
            </span>
          </span>
        </div>
        <div class="modal-row">
          <span class="modal-label">Сумма:</span>
          <span class="modal-value order-sum">{{ formatPrice(order.totalPrice) }} ₽</span>
        </div>
        <div class="modal-row">
          <span class="modal-label">Доставка:</span>
          <span class="modal-value">{{ order.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Курьер' }}</span>
        </div>
        <div v-if="order.deliveryMethod === 'courier' && order.address" class="modal-row">
          <span class="modal-label">Адрес:</span>
          <span class="modal-value">{{ order.address.city }}, {{ order.address.street }}, д.{{ order.address.home }}, кв.{{ order.address.flat }}</span>
        </div>
      </div>
      <div class="modal-section section-contact">
        <div class="modal-section-title">Контакт</div>
        <div class="modal-row"><span class="modal-label">Имя:</span> <span class="modal-value">{{ order.contact.name }}</span></div>
        <div class="modal-row"><span class="modal-label">Телефон:</span> <span class="modal-value">{{ order.contact.phone }}</span></div>
        <div class="modal-row"><span class="modal-label">Email:</span> <span class="modal-value">{{ order.contact.email }}</span></div>
      </div>
      <div class="modal-section section-products">
        <div class="modal-section-title">Товары</div>
        <ul class="modal-items">
          <li v-for="item in order.items" :key="item.id" class="modal-item">
            <span class="item-dot"></span>
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty">×{{ item.quantity }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: { type: Object, required: true },
  onClose: { type: Function, required: true }
});

const handleClose = () => {
  props.onClose();
};

const formatPrice = price => Number(price).toLocaleString('ru-RU');
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(30, 30, 40, 0.38);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.18s;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-window {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 40px 0 rgba(80, 80, 120, 0.22);
  padding: 38px 32px 28px 32px;
  min-width: 340px;
  max-width: 98vw;
  min-height: 220px;
  position: relative;
  animation: modalIn 0.22s cubic-bezier(.4,1.3,.6,1) 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
@keyframes modalIn {
  from { transform: scale(0.96) translateY(30px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 22px;
  font-size: 2.2rem;
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  transition: color 0.18s, background 0.18s;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  &:hover {
    color: #fff;
    background: #750DC5;
  }
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 10px;
  text-align: center;
  letter-spacing: 0.2px;
}
.modal-section {
  background: #faf9ff;
  border-radius: 14px;
  padding: 18px 16px 12px 16px;
  margin-bottom: 0;
  box-shadow: 0 1px 8px 0 rgba(120, 80, 200, 0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-main {
  background: #f7f7fa;
  box-shadow: none;
  margin-bottom: 0;
}
.section-contact {
  margin-top: 0;
}
.section-products {
  margin-top: 0;
}
.modal-section-title {
  font-size: 1.08rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #750DC5;
  letter-spacing: 0.2px;
}
.modal-row {
  display: flex;
  gap: 8px;
  font-size: 1.04rem;
  align-items: center;
  margin-bottom: 2px;
}
.modal-label {
  color: #888;
  min-width: 80px;
  font-size: 0.97rem;
  font-weight: 500;
}
.modal-value {
  font-weight: 500;
  color: #222;
}
.order-sum {
  color: #750DC5;
  font-size: 1.13rem;
  font-weight: 800;
}
.status-success {
  color: #1a9b1a;
  background: #e6fbe6;
  border-radius: 8px;
  padding: 2px 12px 2px 8px;
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.01rem;
}
.status-other {
  color: #b97a1a;
  background: #fbeee6;
  border-radius: 8px;
  padding: 2px 12px 2px 8px;
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.01rem;
}
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 7px;
  display: inline-block;
}
.dot-success {
  background: #1a9b1a;
}
.dot-other {
  background: #b97a1a;
}
.modal-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.modal-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.01rem;
  color: #444;
  padding: 4px 0;
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
  font-size: 0.97rem;
  font-weight: 500;
}
@media (max-width: 600px) {
  .modal-window {
    padding: 12px 2vw 10px 2vw;
    min-width: 0;
  }
  .modal-title {
    font-size: 1.13rem;
  }
  .modal-section {
    padding: 10px 6px 8px 6px;
  }
  .modal-section-title {
    font-size: 1rem;
  }
}
</style> 