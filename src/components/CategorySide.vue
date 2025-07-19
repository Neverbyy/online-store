<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  selectedFilters: {
    type: Object,
    default: () => ({
      brand: [],
      memory: [],
      ram: [],
      cores: []
    })
  },
  priceRange: {
    type: Array,
    default: () => [0, 300000]
  }
});

const emit = defineEmits(['filterChange', 'priceChange']);

const updatePriceRange = (type, value) => {
  // Убираем все нечисловые символы, кроме цифр
  const cleanValue = value.replace(/[^\d]/g, '');
  
  // Преобразуем в число
  let numValue = parseInt(cleanValue) || 0;
  
  // Ограничиваем максимальное значение
  if (numValue > 300000) {
    numValue = 300000;
  }
  
  const newRange = [...props.priceRange];
  if (type === 'min') {
    // Минимальная цена не может быть больше максимальной
    if (numValue > newRange[1]) {
      numValue = newRange[1];
    }
    newRange[0] = numValue;
  } else {
    // Максимальная цена не может быть меньше минимальной
    if (numValue < newRange[0]) {
      numValue = newRange[0];
    }
    newRange[1] = numValue;
  }
  
  emit('priceChange', newRange);
};

const applyFilters = () => {
  // Вызов метода для применения фильтров
};

const resetFilters = () => {
  // Сброс диапазона цен
  emit('priceChange', [0, 300000]);
  // Сброс всех фильтров
  emit('filterChange', 'brand', []);
  emit('filterChange', 'memory', []);
  emit('filterChange', 'ram', []);
  emit('filterChange', 'cores', []);
};

const handleFilterChange = (filterKey, value, checked) => {
  const currentFilters = [...props.selectedFilters[filterKey]];
  
  if (checked) {
    if (!currentFilters.includes(value)) {
      currentFilters.push(value);
    }
  } else {
    const index = currentFilters.indexOf(value);
    if (index > -1) {
      currentFilters.splice(index, 1);
    }
  }
  
  emit('filterChange', filterKey, currentFilters);
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
    name: 'Производитель',
    key: 'brand',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Samsung', value: 'samsung' },
      { label: 'Xiaomi', value: 'xiaomi' },
      { label: 'OnePlus', value: 'oneplus' },
      { label: 'Google', value: 'google' },
      { label: 'ARDOR', value: 'ardor' },
      { label: 'DEXP', value: 'dexp' },
      { label: 'ASUS', value: 'asus' },
      { label: 'Lenovo', value: 'lenovo' },
      { label: 'HP', value: 'hp' },
      { label: 'Dell', value: 'dell' },
      { label: 'MSI', value: 'msi' }
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
                  <div class="price-inputs">
                    <div class="price-input-wrapper">
                      <input 
                        type="text" 
                        class="price-input"
                        :value="priceRange[0].toLocaleString()"
                        @input="updatePriceRange('min', $event.target.value)"
                        @blur="updatePriceRange('min', $event.target.value)"
                        @keyup.enter="updatePriceRange('min', $event.target.value)"
                        placeholder="от"
                      />
                      <span class="price-currency">₽</span>
                    </div>
                    <div class="price-separator"></div>
                    <div class="price-input-wrapper">
                      <input 
                        type="text" 
                        class="price-input"
                        :value="priceRange[1].toLocaleString()"
                        @input="updatePriceRange('max', $event.target.value)"
                        @blur="updatePriceRange('max', $event.target.value)"
                        @keyup.enter="updatePriceRange('max', $event.target.value)"
                        placeholder="до"
                      />
                      <span class="price-currency">₽</span>
                    </div>
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
                        :checked="selectedFilters[filter.key].includes(option.value)"
                        @change="handleFilterChange(filter.key, option.value, $event.target.checked)"
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
.sidebar-input input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #0018A8;
  border-radius: 6px;
  margin-right: 8px;
  cursor: pointer;
  position: relative;
  background-color: white;
  vertical-align: middle;
  transition: all 0.2s ease;
}

/* Галочка */
.sidebar-input input[type="checkbox"]::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 8px;
  width: 6px;
  height: 12px;
  border: solid #0018A8;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.sidebar-input input[type="checkbox"]:checked::after {
  opacity: 1;
}
    .sidebar{
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #f9f9f9;
        width: 300px;
        height: fit-content;
        position: sticky;
        top: 20px;

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
  
  .price-inputs {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .price-input-wrapper {
    position: relative;
    flex: 1;
  }
  
  .price-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f8f9fa;
    font-size: 14px;
    color: #333;
    outline: none;
    transition: all 0.2s ease;
    text-align: center;
    
    &:focus {
      border-color: #750DC5;
      background-color: white;
      box-shadow: 0 0 0 2px rgba(117, 13, 197, 0.1);
    }
    
    &::placeholder {
      color: #999;
    }
  }
  
  .price-currency {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    font-size: 14px;
    pointer-events: none;
    font-weight: 500;
  }
  
  .price-separator {
    width: 1px;
    height: 24px;
    background-color: #e0e0e0;
    margin: 0 6px;
  }
}

.range-values {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}
</style>