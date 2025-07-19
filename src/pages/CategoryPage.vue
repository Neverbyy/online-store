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
        <div class="category-page">

        <CategorySide 
          :selectedFilters="selectedFilters"
          :priceRange="priceRange"
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
</style>