<script setup>
import { ref } from 'vue';

const priceRange = ref([0, 100000]); // Диапазон цен по умолчанию

const updatePriceRange = (range) => {
  priceRange.value = range;
};

const applyFilters = () => {
  // Вызов метода для применения фильтров
};

const resetFilters = () => {
  priceRange.value = [0, 100000]; // Сброс диапазона цен
  // Сброс других фильтров по необходимости
};

const filters = ref([
  {
    name: 'Встроенная память',
    key: 'memory',
    options: [
      { label: '512 ГБ', value: '512GB' },
      { label: '256 ГБ', value: '256GB' },
      { label: '128 ГБ', value: '128GB' },
      { label: '64 ГБ', value: '64GB' },
      { label: '32 ГБ', value: '32GB' }
    ],
    showAll: false
  },
  {
    name: 'Оперативная память',
    key: 'ram',
    options: [
      { label: '16 ГБ', value: '16GB' },
      { label: '8 ГБ', value: '8GB' },
      { label: '4 ГБ', value: '4GB' },
      { label: '2 ГБ', value: '2GB' }
    ],
    showAll: false
  },
  {
    name: 'Бренд',
    key: 'brand',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Samsung', value: 'samsung' },
      { label: 'Huawei', value: 'huawei' },
      { label: 'Xiaomi', value: 'xiaomi' }
    ],
    showAll: false
  },
  {
    name: 'Кол-во ядер',
    key: 'cores',
    options: [
      { label: '8 ядер', value: '8' },
      { label: '6 ядер', value: '6' },
      { label: '4 ядра', value: '4' },
      { label: '2 ядра', value: '2' }
    ],
    showAll: false
  }
]);

const toggleShowAll = (filterKey) => {
  const filter = filters.value.find(f => f.key === filterKey);
  filter.showAll = !filter.showAll;
};

</script>

<template>
    <div class="sidebar">
        <div class="sidebar-inner">

            <div class="sidebar-inner">
                <h3>Цена, ₽</h3>
                <div class="price-range">
                <input type="range" min="0" max="100000" v-model="priceRange" @input="updatePriceRange($event.target.valueAsNumber)">
                  <div class="range-values">
                    От {{ priceRange[0] }} до {{ priceRange[1] }} ₽
                  </div>
                </div>
                <div 
                v-for="filter in filters" 
                :key="filter.key">
                <h3>{{ filter.name }}</h3>
                <transition-group name="expand" tag="div">
                    <div 
                    v-for="(option, index) in filter.options" 
                    :key="option.value"
                    v-show="filter.showAll || index < 2"
                    class="sidebar-input">

                    <label>
                        <input
                        type="checkbox"
                        :value="option.value"
                        />
                        {{ option.label }}
                    </label>
                    </div>
                </transition-group>
                    <button class="btn-more" @click="toggleShowAll(filter.key)">
                    {{ filter.showAll ? 'Скрыть' : 'Ещё' }}
                    </button>
                </div>
                
                <div class="sidebar-btns">
                  <button class="btn-accept">Применить</button>
                  <button class="btn-reset" @click="resetFilters">Сбросить фильтры</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    .sidebar{
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #f9f9f9;
        width: 300px;

        input{
            margin-right: 8px;
        }

        .btn-more{
            margin-top: 12px;
            color: #750DC5;
        }
    }
    .sidebar-btns{
      margin-top: 30px;
    }
    .btn-accept, .btn-reset{
        color: #750DC5;
        padding-bottom: 10px;
    }

    .expand-enter-active, 
    .expand-leave-active {
    transition: all 0.3s ease;
    }

    .expand-enter-from, 
    .expand-leave-to {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    }

    .expand-enter-to, 
    .expand-leave-from {
    max-height: 40px; /* Adjust based on the height of your elements */
    opacity: 1;
  }
    
.price-range {
  margin-bottom: 15px;
}

.range-values {
  display: flex;
  justify-content: space-between;
}
</style>