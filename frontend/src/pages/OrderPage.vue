<script setup>
import { computed, onMounted, ref } from 'vue'
import {useStore} from 'vuex';
import { useRouter } from 'vue-router';
import buttonCart from '/src/components/UI/buttonCart.vue'
import FormInput from '../components/UI/FormInput.vue';
import axios from 'axios';
import { getApiUrl, API_CONFIG } from '../config/api';

const store = useStore();
const router = useRouter();
const isLoading = ref(false);

const deliveryMethod = computed({
  get: () => store.getters.getDeliveryMethod,
  set: value => store.dispatch('setDeliveryMethod', value)
});

const contact = computed({
  get: () => store.getters.getContact,
  set: value => store.dispatch('setContact', value)
});

const address = computed({
  get: () => store.getters.getAddress,
  set: value => store.dispatch('setAddress', value)
});

const formattedTotalPrice = computed(() => store.getters['cart/formattedTotalPrice']);

// Автоматическое заполнение адреса из профиля пользователя
const fillAddressFromProfile = () => {
  const profileUser = store.getters['profile/getUser'];
  if (profileUser && profileUser.addresses && profileUser.addresses.length > 0) {
    const lastAddress = profileUser.addresses[profileUser.addresses.length - 1];
    store.dispatch('setAddress', {
      city: lastAddress.city || '',
      street: lastAddress.street || '',
      home: lastAddress.home || '',
      flat: lastAddress.flat || ''
    });
  }
};

const submitForm = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  try {
    // --- Создание заказа на сервере ---
    const cartItems = store.getters['cart/getCart'];
    const totalPrice = store.getters['cart/getTotalPrice'];
    const user = store.getters['profile/getUser'] || {};
    const order = {
      date: new Date().toLocaleString('ru-RU'),
      deliveryMethod: deliveryMethod.value,
      contact: { ...contact.value },
      address: deliveryMethod.value === 'courier' ? { ...address.value } : null,
      items: cartItems,
      totalPrice: totalPrice,
      status: 'Ожидает оплаты',
      userId: user.id || null,
      userPhone: user.phone || null
    };

    // Создаем заказ
            const orderResponse = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.ORDERS), order);
    const createdOrder = orderResponse.data.order;

    // Добавление адреса в профиль пользователя, если выбран курьер
    if (deliveryMethod.value === 'courier' && user.id) {
      await store.dispatch('profile/addAddress', address.value);
    }

    // НЕ очищаем корзину до подтверждения оплаты
    // store.dispatch('cart/clearCart');

    // --- Создание платежа через YooKassa ---
    const paymentData = {
      value: totalPrice.toString(),
      orderId: createdOrder.id,
      userId: user.id || null
    };

            const paymentResponse = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT), paymentData);
    const payment = paymentResponse.data.payment;

    // Обновляем заказ с paymentId
    if (payment.id) {
              await axios.put(getApiUrl(`${API_CONFIG.ENDPOINTS.ORDERS}/${createdOrder.id}`), {
        paymentId: payment.id
      });
    }

    // Очищаем корзину после создания заказа и перенаправления на оплату
    store.dispatch('cart/clearCart');

    // Перенаправляем на страницу оплаты YooKassa
    if (payment.confirmation && payment.confirmation.confirmation_url) {
      console.log('Перенаправление на оплату:', payment.confirmation.confirmation_url);
      window.location.href = payment.confirmation.confirmation_url;
    } else {
      console.error('Ошибка: confirmation_url не найден в ответе:', payment);
      throw new Error('Не удалось получить ссылку для оплаты');
    }

  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    alert('Ошибка при оформлении заказа! Попробуйте еще раз.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const profileUser = store.getters['profile/getUser'];
  const contactData = store.getters.getContact;
  
  // Если пользователь авторизован, заполняем данные из профиля
  if (profileUser && profileUser.phone) {
    store.dispatch('setContact', {
      phone: profileUser.phone || contactData.phone || '',
      email: profileUser.email || contactData.email || ''
    });
  }
});

// Следим за изменением метода доставки
const handleDeliveryMethodChange = () => {
  if (deliveryMethod.value === 'courier') {
    fillAddressFromProfile();
  }
};

</script>

<template>
    <div class="main container">
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link :to="{ name: 'Home' }">Главная</router-link></li>
                <li class="breadcrumb-item"><router-link :to="{ name: 'Cart' }">Корзина</router-link></li>
                <li class="breadcrumb-item active" aria-current="page">Оформление заказа</li>
            </ol>
        </nav>
        <div class="orderform">
            <h1>Оформление заказа</h1>
            
            <div class="custom-select">
                <select class="delivery" v-model="deliveryMethod" @change="handleDeliveryMethodChange">
                    <option value="pickup">Самовывоз</option>
                    <option value="courier">Курьер</option>
                </select>
                <span class="custom-arrow"></span>
            </div>

            <form @submit.prevent="submitForm" class="contactform">
                <div class="order-details">
                    <h3>Контактные данные</h3>
                    <FormInput
                        v-model="contact.phone"
                        type="tel"
                        placeholder="Телефон"
                        required
                        mask="+7 (###) ###-##-##"
                    />
                    <FormInput v-model="contact.email" type="email" placeholder="Email (необязательно)"/>
                </div>

                <div class="order-details" v-if="deliveryMethod === 'courier'">
                    <h3>Адрес доставки</h3>
                    <FormInput v-model="address.city" placeholder="Город*" required />
                    <FormInput v-model="address.street" placeholder="Улица*" required />
                    <div class="order-details-home">
                        <FormInput v-model="address.home" placeholder="Дом*" required/>
                        <FormInput v-model="address.flat" placeholder="Квартира*" required/>
                    </div>
                </div>

                <div class="payment">
                    <h3>Оплата</h3>
                </div>

                <div class="confirm">
                    <h3>Итого: {{ formattedTotalPrice }} ₽</h3>
                    <buttonCart :disabled="isLoading">
                        {{ isLoading ? 'Обработка...' : 'Перейти к оплате' }}
                    </buttonCart>
                </div>
            </form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.orderform{
    text-align: center;
}

.custom-select {
  position: relative;
  display: inline-block;
  margin-top: 28px;
}

option{
    border: 1px solid #750DC5;
    border-radius: 8px;
}

.delivery{
    border: 1px solid #750DC5;
    position: relative;
    border-radius: 6px;
    width: 340px;
    padding: 12px 16px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font-weight: 600;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid #000000; /* Цвет и размер стрелки */
  pointer-events: none;
}

h3{
    font-weight: 600;
}
.order-details{
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

::placeholder{
    font-size: 16px;
    font-weight: 200;
    color: #454545;
}

.order-details-home{
    display: flex;
    column-gap: 110px;
    max-width: 400px;
}

.payment-note {
    font-size: 0.9rem;
    color: #666;
    margin: 8px 0 16px 0;
    font-style: italic;
}
</style>