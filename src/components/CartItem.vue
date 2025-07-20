<script setup>
import ButtonCart from './UI/buttonCart.vue';
import { defineProps } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
    item: Object,
    removeFromCart: Function
});

const store = useStore();

const increment = () => {
    if (props.item.quantity < 20) {
        store.dispatch('cart/incrementQuantity', props.item.id);
    }
};

const decrement = () => {
    if (props.item.quantity > 1) {
        store.dispatch('cart/decrementQuantity', props.item.id);
    }
};

</script>

<template>
    <div class="cart__main-item">
        <div class="cart__main-details">
            <img class="cart__main-image" :src="item.image" alt="">
            <div class="cart__main-details-left">
                <h2>{{ item.name }}</h2>
                <h2>{{ item.price }} Руб.</h2>
                <div>
                <ul class="cart__main-details-left-features" v-for="(value, key) in item.features" :key="key"> 
                    <li>{{ key + ' ' + value + ' '}}</li>
                </ul>
                </div>
            </div>
            <div class="cart__main-details-right">
                <div class="cart__main-details-right-btns">
                    <ButtonCart @click="removeFromCart(item.id)"><slot>Удалить</slot></ButtonCart>
                    <div class="cart__main-item-counter">
                        <button 
                            class="counter-btn decrement"
                            :class="{disabled: item.quantity === 1 }"
                            @click="decrement">
                        </button>
                            <span>{{ item.quantity }}</span>
                        <button 
                            class="counter-btn increment"
                            :class="{ disabled: item.quantity === 20 }"
                            @click="increment">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.cart__main{

    &-image{
        max-width: 200px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    &-item{
        background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
        border-radius: 16px;
        padding: 24px;
        margin: 16px 0;
        box-shadow: 0 2px 20px rgba(117, 13, 197, 0.08);
        border: 1px solid rgba(117, 13, 197, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
            box-shadow: 0 8px 32px rgba(117, 13, 197, 0.12);
            transform: translateY(-1px);
        }
    }

    &-details{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;

        &-left{
            flex: auto;
            margin-left: 0;

            h2 {
                margin: 0 0 8px 0;
                font-weight: 600;
                color: #2d3748;
                font-size: 1.25rem;
                line-height: 1.4;
                
                &:last-of-type {
                    color: #750DC5;
                    font-weight: 700;
                    font-size: 1.5rem;
                    margin-bottom: 16px;
                }
            }

            &-features{
                font-weight: 400;
                color: #718096;
                font-size: 0.95rem;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                list-style: none;

                li{
                    padding: 4px 0;
                    position: relative;
                    padding-left: 16px;
                    
                    &::before {
                        content: '•';
                        color: #750DC5;
                        font-weight: bold;
                        position: absolute;
                        left: 0;
                    }
                }
            }
        }
        
        &-right{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;

            &-btns{
                display: flex;
                column-gap: 30px;
                align-items: center;
            }
        }
    }
}

.cart__main-item-counter {
  display: flex;
  align-items: center;
  gap: 5px;
  border: solid 1px #750DC5;
  border-radius: 8px;
  width: 100px;
  justify-content: space-between;
}

.counter-btn {
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: #750DC5;
}

.counter-btn.decrement::before,
.counter-btn.increment::before {
  content: '';
  width: 14px;
  height: 14px;
  background-repeat: no-repeat;
}

.counter-btn.increment::before {
  background-image: url('/src/assets/add.png');
}
.counter-btn.decrement::before {
  background-image: url('/src/assets/remove.png');
  align-self: flex-end;
}
</style>