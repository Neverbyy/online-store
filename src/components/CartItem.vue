<script setup>
import ButtonCart from './UI/buttonCart.vue';
import { defineProps } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
    item: Object,
    index: Number,
    removeFromCart: Function
});

const store = useStore();

const increment = () => {
    if (props.item.quantity < 20) {
        store.dispatch('cart/incrementQuantity', props.index);
    }
};

const decrement = () => {
    if (props.item.quantity > 1) {
        store.dispatch('cart/decrementQuantity', props.index);
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
                    <ButtonCart @click="removeFromCart"><slot>Удалить</slot></ButtonCart>
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
    }
    &-item{
        border-top: 1px solid gray;
        border-bottom: 1px solid gray;
        padding: 15px;
    }

    &-details{
        display: flex;
        justify-content: space-between;

        &-left{
        flex: auto;
        margin-left: 15px;

            &-features{
                font-weight: 300;
                row-gap: 10px;

                li{
                    padding-top: 5px;
                }
            }
        }
        &-right{
            display: flex;
            flex-direction: column;
            justify-content: center;

            &-btns{
                display: flex;
                column-gap: 30px;
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