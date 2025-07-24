<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

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
  },
  brands: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['filterChange', 'priceChange']);

// Отслеживаем изменения priceRange извне
watch(() => props.priceRange, (newRange) => {
  nextTick(() => {
    updateSliderTrack(newRange);
  });
}, { deep: true });

const updatePriceRange = (type, value) => {
  const numValue = parseInt(value) || 0;
  const newRange = [...props.priceRange];
  
  if (type === 'min') {
    // Минимальная цена не может быть больше максимальной
    const maxValue = Math.min(numValue, newRange[1]);
    newRange[0] = maxValue;
  } else {
    // Максимальная цена не может быть меньше минимальной
    const minValue = Math.max(numValue, newRange[0]);
    newRange[1] = minValue;
  }
  
  // Обновляем трек немедленно для синхронизации
  updateSliderTrack(newRange);
  emit('priceChange', newRange);
};

const updateSliderTrack = (range) => {
  const minPercent = (range[0] / 300000) * 100;
  const maxPercent = (range[1] / 300000) * 100;
  
  const track = document.querySelector('.slider-track');
  if (track) {
    track.style.setProperty('--min-percent', `${minPercent}%`);
    track.style.setProperty('--max-percent', `${maxPercent}%`);
  }
};

const handleSliderStart = () => {
  // Добавляем класс для более плавной анимации при перетаскивании
  const track = document.querySelector('.slider-track');
  if (track) {
    track.classList.add('dragging');
  }
};

const handleSliderEnd = () => {
  // Убираем класс после окончания перетаскивания
  const track = document.querySelector('.slider-track');
  if (track) {
    track.classList.remove('dragging');
  }
};

const resetFilters = () => {
  // Сброс диапазона цен
  const newPriceRange = [0, 300000];
  emit('priceChange', newPriceRange);
  // Обновляем визуальное отображение ползунка
  nextTick(() => {
    updateSliderTrack(newPriceRange);
  });
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
    options: props.brands.length > 0 ? props.brands : [
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

onMounted(() => {
  updateSliderTrack(props.priceRange);
});

</script>

<template>
    <div class="sidebar">
        <div class="sidebar-inner">

            <div class="sidebar-inner">
                <h3>Цена, ₽</h3>
                <div class="price-range">
                  <div class="price-slider">
                    <div class="slider-track"></div>
                    <input 
                      type="range" 
                      class="slider-input slider-min"
                      :min="0"
                      :max="300000"
                      :value="priceRange[0]"
                      @input="updatePriceRange('min', $event.target.value)"
                      @mousedown="handleSliderStart"
                      @mouseup="handleSliderEnd"
                      @touchstart="handleSliderStart"
                      @touchend="handleSliderEnd"
                    />
                    <input 
                      type="range" 
                      class="slider-input slider-max"
                      :min="0"
                      :max="300000"
                      :value="priceRange[1]"
                      @input="updatePriceRange('max', $event.target.value)"
                      @mousedown="handleSliderStart"
                      @mouseup="handleSliderEnd"
                      @touchstart="handleSliderStart"
                      @touchend="handleSliderEnd"
                    />
                  </div>
                  <div class="price-values">
                    <span class="price-value">{{ priceRange[0].toLocaleString() }} ₽</span>
                    <span class="price-value">{{ priceRange[1].toLocaleString() }} ₽</span>
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
  
  .price-slider {
    position: relative;
    height: 40px;
    margin: 20px 0;
    
    .slider-track {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      transform: translateY(-50%);
      --min-percent: 0%;
      --max-percent: 100%;
      
      &::before {
        content: '';
        position: absolute;
        left: var(--min-percent);
        right: calc(100% - var(--max-percent));
        height: 100%;
        background: #750DC5;
        border-radius: 2px;
        transition: all 0.1s ease;
      }
      
      &.dragging::before {
        transition: none;
      }
    }
    
    .slider-input {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      width: 100%;
      height: 4px;
      background: transparent;
      pointer-events: none;
      appearance: none;
      -webkit-appearance: none;
      transform: translateY(-50%);
      
      &::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        background: #750DC5;
        border-radius: 50%;
        cursor: pointer;
        pointer-events: auto;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        
        &:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      }
      
      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #750DC5;
        border-radius: 50%;
        cursor: pointer;
        pointer-events: auto;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        
        &:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      }
      
      &::-webkit-slider-track {
        background: transparent;
        border: none;
      }
      
      &::-moz-range-track {
        background: transparent;
        border: none;
      }
    }
    
    .slider-min {
      z-index: 2;
    }
    
    .slider-max {
      z-index: 1;
    }
  }
  
  .price-values {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    
    .price-value {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
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