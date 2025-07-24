<script setup>
import { computed, onMounted } from 'vue'
import {useStore} from 'vuex';
import { useRouter } from 'vue-router';
import buttonCart from '/src/components/UI/buttonCart.vue'
import FormInput from '../components/UI/FormInput.vue';
import axios from 'axios';

const store = useStore();
const router = useRouter();

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

const submitForm = async () => {
  // Логика отправки формы
  console.log('Delivery Method:', deliveryMethod.value);
  console.log('Contact:', contact.value);
  console.log('Address:', address.value);

  // --- Отправка заказа на сервер ---
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
    status: 'Оформлен',
    userId: user.id || null,
    userPhone: user.phone || null
  };
  try {
    await axios.post('http://localhost:5000/api/orders', order);
  } catch (e) {
    alert('Ошибка при оформлении заказа!');
    return;
  }
  // --- конец блока отправки заказа ---

  // Добавление адреса в профиль пользователя, если выбран курьер
  if (deliveryMethod.value === 'courier' && user.id) {
    await store.dispatch('profile/addAddress', address.value);
  }

  // Логика обработки успешного заказа
  store.dispatch('markOrderAsSuccess'); // Устанавливаем флаг успешного заказа в store
  sessionStorage.setItem('orderSuccess', 'true'); // Устанавливаем флаг успешного заказа в sessionStorage

  // Очищаем корзину
  store.dispatch('cart/clearCart');

  // Перенаправляем на страницу успешного заказа
  router.push({ name: 'OrderSuccess' });
};

onMounted(() => {
  const profileUser = store.getters['profile/getUser'];
  const contactData = store.getters.getContact;
  if (profileUser && profileUser.phone && !contactData.phone) {
    store.dispatch('setContact', {
      name: profileUser.name || '',
      phone: profileUser.phone || '',
      email: profileUser.email || ''
    });
  }
});

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
                <select class="delivery" v-model="deliveryMethod">
                    <option value="pickup">Самовывоз</option>
                    <option value="courier">Курьер</option>
                </select>
                <span class="custom-arrow"></span>
            </div>

            <form @submit.prevent="submitForm" class="contactform">
                <div class="order-details">
                    <h3>Контактные данные</h3>
                    <FormInput v-model="contact.name" placeholder="Имя" required />
                    <FormInput
                        v-model="contact.phone"
                        type="tel"
                        placeholder="Телефон"
                        required
                        mask="+7 (###) ###-##-##"
                    />
                    <FormInput v-model="contact.email" type="email" placeholder="Email" required/>
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
                    <buttonCart>Оплатить</buttonCart>
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
</style>