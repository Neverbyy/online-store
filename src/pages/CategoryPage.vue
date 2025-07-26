<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter  } from 'vue-router';
import {useStore} from 'vuex';
import CategoryList from '../components/CategoryList.vue';
import CategorySide from '../components/CategorySide.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();

const categoryExists = ref(false);
const showFiltersModal = ref(false);
const selectedFilters = ref({
  brand: [],
  memory: [],
  ram: [],
  cores: []
});
const priceRange = ref([0, 300000]); // Диапазон цен по умолчанию

const category = computed(() => route.params.category);
const items = computed(() => store.getters.getItems);

// Фильтрация товаров по категории и выбранным фильтрам
const filteredProducts = computed(() => {
  let filtered = items.value.filter(item => item.category === category.value);
  
  // Фильтрация по цене
  filtered = filtered.filter(item => {
    const price = parseInt(item.price.replace(/\s/g, '')); // Убираем пробелы из цены
    return price >= priceRange.value[0] && price <= priceRange.value[1];
  });
  
  // Фильтрация по бренду
  if (selectedFilters.value.brand.length > 0) {
    filtered = filtered.filter(item => 
      selectedFilters.value.brand.includes(item.brand.toLowerCase())
    );
  }
  
  // Фильтрация по памяти (если есть в features)
  if (selectedFilters.value.memory.length > 0) {
    filtered = filtered.filter(item => {
      const memoryValue = item.features['Объем памяти'];
      return selectedFilters.value.memory.some(filter => 
        memoryValue && memoryValue.includes(filter.replace('GB', ' GB'))
      );
    });
  }
  
  // Фильтрация по оперативной памяти (если есть в features)
  if (selectedFilters.value.ram.length > 0) {
    filtered = filtered.filter(item => {
      const ramValue = item.features['Оперативная память'];
      return selectedFilters.value.ram.some(filter => 
        ramValue && ramValue.includes(filter.replace('GB', ' GB'))
      );
    });
  }
  
  return filtered;
});

const categoryName = computed(() => store.getters.getCategoryNameById(category.value));

const categoryBrands = computed(() => {
  const filtered = items.value.filter(item => item.category === category.value);
  const brandsSet = new Set(filtered.map(item => item.brand));
  return Array.from(brandsSet).map(b => ({
    label: b.charAt(0).toUpperCase() + b.slice(1),
    value: b.toLowerCase()
  }));
});

const handleFilterChange = (filterType, values) => {
  selectedFilters.value[filterType] = values;
};

const handlePriceChange = (newRange) => {
  priceRange.value = newRange;
};

const removeFilter = (filterType, value) => {
  if (filterType === 'price') {
    // Сброс диапазона цен к дефолтному
    priceRange.value = [0, 300000];
  } else {
    const currentFilters = [...selectedFilters.value[filterType]];
    const index = currentFilters.indexOf(value);
    if (index > -1) {
      currentFilters.splice(index, 1);
      selectedFilters.value[filterType] = currentFilters;
    }
  }
};

const getFilterLabel = (filterType, value) => {
  const filterConfigs = {
    brand: {
      apple: 'Apple',
      samsung: 'Samsung',
      xiaomi: 'Xiaomi',
      oneplus: 'OnePlus',
      google: 'Google',
      ardor: 'ARDOR',
      dexp: 'DEXP',
      asus: 'ASUS',
      lenovo: 'Lenovo',
      hp: 'HP',
      dell: 'Dell',
      msi: 'MSI'
    },
    memory: {
      '512GB': '512 ГБ',
      '256GB': '256 ГБ',
      '128GB': '128 ГБ',
      '64GB': '64 ГБ',
      '32GB': '32 ГБ'
    },
    ram: {
      '16GB': '16 ГБ',
      '8GB': '8 ГБ',
      '4GB': '4 ГБ',
      '2GB': '2 ГБ'
    },
    cores: {
      '8': '8 ядер',
      '6': '6 ядер',
      '4': '4 ядра',
      '2': '2 ядра'
    }
  };
  
  return filterConfigs[filterType]?.[value] || value;
};

const getActiveFilters = computed(() => {
  const active = [];
  
  // Добавляем фильтр по цене, если он отличается от дефолтного
  if (priceRange.value[0] > 0 || priceRange.value[1] < 300000) {
    active.push({
      type: 'price',
      value: `${priceRange.value[0]}-${priceRange.value[1]}`,
      label: `от ${priceRange.value[0].toLocaleString()} ₽ до ${priceRange.value[1].toLocaleString()} ₽`
    });
  }
  
  Object.entries(selectedFilters.value).forEach(([filterType, values]) => {
    values.forEach(value => {
      active.push({
        type: filterType,
        value: value,
        label: getFilterLabel(filterType, value)
      });
    });
  });
  return active;
});

const handleOpenFilters = () => {
  showFiltersModal.value = true;
};

const handleCloseFilters = () => {
  showFiltersModal.value = false;
};

onMounted(async () => {
  await store.dispatch('fetchItems');
  categoryExists.value = items.value.some(item => item.category === category.value);
  if (!categoryExists.value) {
    router.push({ name: 'NotFound' });
  }
});

const props = defineProps({
  products: Array
})

</script>

<template>
    <div class="main container">
      <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link :to="{ name: 'Catalog' }">Каталог</router-link></li>
        <li class="breadcrumb-item"><router-link :to="{ name: 'Category', params: { category } }">{{ categoryName }}</router-link></li>
      </ol>
    </nav>
        <h1>{{ categoryName }}</h1>
        
        <!-- Мобильная панель с кнопками -->
        <div class="mobile-controls">
          <button class="btn-filters" @click="handleOpenFilters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4H21V6H3V4ZM6 11H18V13H6V11ZM9 18H15V20H9V18Z" fill="currentColor"/>
            </svg>
            Фильтры
          </button>
        </div>
        
        <div class="category-page">

        <!-- Десктопная боковая панель -->
        <CategorySide 
          class="desktop-filters"
          :selectedFilters="selectedFilters"
          :priceRange="priceRange"
          :brands="categoryBrands"
          @filterChange="handleFilterChange"
          @priceChange="handlePriceChange"
        />

        <div class="category-content">
          <div class="results-info">
            <p>Найдено товаров: {{ filteredProducts.length }}</p>
            <div v-if="getActiveFilters.length > 0" class="active-filters">
              <span class="filters-label">Применённые фильтры:</span>
              <div class="filter-tags">
                <span 
                  v-for="filter in getActiveFilters" 
                  :key="`${filter.type}-${filter.value}`"
                  class="filter-tag"
                >
                  {{ filter.label }}
                  <button 
                    class="filter-remove" 
                    @click="removeFilter(filter.type, filter.value)"
                    title="Удалить фильтр"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>
          <CategoryList 
          :products="filteredProducts"
          />
        </div>
        </div>
        
        <!-- Модальное окно фильтров -->
        <div v-if="showFiltersModal" class="filters-modal-overlay" @click="handleCloseFilters">
          <div class="filters-modal" @click.stop>
            <div class="filters-modal-header">
              <h3>Фильтры</h3>
              <button class="btn-close" @click="handleCloseFilters">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div class="filters-modal-content">
              <CategorySide 
                :selectedFilters="selectedFilters"
                :priceRange="priceRange"
                :brands="categoryBrands"
                @filterChange="handleFilterChange"
                @priceChange="handlePriceChange"
              />
            </div>
          </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.category-page {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.category-content {
  flex: 1;
}

.results-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
}

.active-filters {
  margin-top: 10px;
  
  .filters-label {
    display: block;
    font-size: 12px;
    color: #888;
    margin-bottom: 8px;
  }
  
  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .filter-tag {
    display: inline-flex;
    align-items: center;
    background-color: #750DC5;
    color: white;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    
    .filter-remove {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      font-weight: bold;
      margin-left: 6px;
      cursor: pointer;
      padding: 0;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      
      &:focus {
        outline: none;
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

// Мобильная панель управления
.mobile-controls {
  display: none;
  margin: 20px 0;
  
  .btn-filters {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: #750DC5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #5a0a9a;
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
}

// Модальное окно фильтров
.filters-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.filters-modal {
  background-color: white;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  .filters-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #eee;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .btn-close {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #f5f5f5;
      }
      
      svg {
        width: 20px;
        height: 20px;
        color: #666;
      }
    }
  }
  
  .filters-modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 0;
    
    :deep(.sidebar) {
      width: 100%;
      border: none;
      border-radius: 0;
      background-color: white;
      position: static;
      padding: 20px;
      
      .sidebar-inner {
        padding: 0;
      }
      
      // Стили для ползунка в модальном окне
      .slider-track {
        background: #e0e0e0 !important;
        
        &::before {
          background: #750DC5 !important;
        }
      }
    }
  }
}

// Адаптивные стили - только для мобильных устройств
@media (max-width: 900px) {
  .category-page {
    flex-direction: column;
    gap: 0;
  }
  
  .desktop-filters {
    display: none;
  }
  
  .mobile-controls {
    display: block;
  }
  
  .category-content {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .main.container {
    padding: 0 16px;
    padding-bottom: 80px; // Отступ от мобильной навигации
  }
  
  .breadcrumb {
    font-size: 14px;
  }
  
  h1 {
    font-size: 24px;
    margin: 16px 0;
  }
  
  .results-info {
    margin-bottom: 16px;
    padding: 12px;
    
    p {
      font-size: 13px;
    }
  }
  
  .active-filters {
    .filter-tags {
      gap: 6px;
    }
    
    .filter-tag {
      font-size: 11px;
      padding: 3px 6px;
    }
  }
  
  .filters-modal {
    max-height: 90vh;
    
    .filters-modal-header {
      padding: 16px;
      
      h3 {
        font-size: 16px;
      }
    }
    
    .filters-modal-content {
      :deep(.sidebar) {
        padding: 16px;
      }
    }
  }
}
</style>