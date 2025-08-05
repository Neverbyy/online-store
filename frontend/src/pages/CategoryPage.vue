<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter  } from 'vue-router';
import {useStore} from 'vuex';
import CategoryList from '../components/CategoryList.vue';
import CategorySide from '../components/CategorySide.vue';
import { useCategoryFilters } from '../composables/useCategoryFilters.js';
import { getImageUrl } from '../utils/imageUtils.js';

const store = useStore();
const route = useRoute();
const router = useRouter();

const categoryExists = ref(false);
const showFiltersModal = ref(false);
const isLoading = ref(true); // Добавляем состояние загрузки
const sortDirection = ref('none'); // none, asc, desc
const isFiltering = ref(false); // Состояние фильтрации

const category = computed(() => route.params.category);
const items = computed(() => store.getters.getItems);

// Используем composable для фильтров
const {
  selectedFilters,
  priceRange,
  filteredProducts,
  categoryBrands,
  showOSFilter,
  categoryOS,
  showResolutionFilter,
  categoryResolution,
  showRefreshRateFilter,
  categoryRefreshRate,
  showMemoryFilter,
  showRamFilter,
  showProcessorFilter,
  categoryProcessors,
  showGpuFilter,
  categoryGpu,
  showDiagonalFilter,
  categoryDiagonal,
  showTypeFilter,
  categoryTypes,
  getActiveFilters,
  handleFilterChange: originalHandleFilterChange,
  handlePriceChange: originalHandlePriceChange,
  removeFilter: originalRemoveFilter,
  getFilterLabel
} = useCategoryFilters(items, category);

// Обертываем функции фильтрации с анимацией
const handleFilterChange = async (filterType, values) => {
  isFiltering.value = true;
  await new Promise(resolve => setTimeout(resolve, 300));
  originalHandleFilterChange(filterType, values);
  isFiltering.value = false;
};

const handlePriceChange = async (newRange) => {
  isFiltering.value = true;
  await new Promise(resolve => setTimeout(resolve, 300));
  originalHandlePriceChange(newRange);
  isFiltering.value = false;
};

const removeFilter = async (filterType, value) => {
  isFiltering.value = true;
  await new Promise(resolve => setTimeout(resolve, 300));
  originalRemoveFilter(filterType, value);
  isFiltering.value = false;
};

const categoryName = computed(() => store.getters.getCategoryNameById(category.value));

// Отсортированные товары
const sortedProducts = computed(() => {
  if (sortDirection.value === 'none') {
    return filteredProducts.value;
  }
  
  const sorted = [...filteredProducts.value];
  sorted.sort((a, b) => {
    const priceA = parseInt(a.price.replace(/\s/g, ''));
    const priceB = parseInt(b.price.replace(/\s/g, ''));
    
    if (sortDirection.value === 'asc') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });
  
  return sorted;
});

const handleSortByPrice = async () => {
  isFiltering.value = true;
  
  // Небольшая задержка для анимации
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (sortDirection.value === 'none') {
    sortDirection.value = 'desc'; // От самых дорогих
  } else if (sortDirection.value === 'desc') {
    sortDirection.value = 'asc'; // От самых дешёвых
  } else {
    sortDirection.value = 'none'; // Без сортировки
  }
  
  isFiltering.value = false;
};

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
  isLoading.value = false; // Устанавливаем загрузку завершенной
  
  // Отладочная информация для иконки сортировки
  console.log('Sort icon available:', isImageAvailable('/src/assets/sort.svg'));
  console.log('Sort icon URL:', getImageUrl('/src/assets/sort.svg'));
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
          v-if="!isLoading"
          class="desktop-filters"
          :selectedFilters="selectedFilters"
          :priceRange="priceRange"
          :brands="categoryBrands"
          :showOSFilter="showOSFilter"
          :categoryOS="categoryOS"
          :showResolutionFilter="showResolutionFilter"
          :categoryResolution="categoryResolution"
          :showRefreshRateFilter="showRefreshRateFilter"
          :categoryRefreshRate="categoryRefreshRate"
          :showMemoryFilter="showMemoryFilter"
          :showRamFilter="showRamFilter"
          :showProcessorFilter="showProcessorFilter"
          :categoryProcessors="categoryProcessors"
          :showGpuFilter="showGpuFilter"
          :categoryGpu="categoryGpu"
          :showDiagonalFilter="showDiagonalFilter"
          :categoryDiagonal="categoryDiagonal"
          :showTypeFilter="showTypeFilter"
          :categoryTypes="categoryTypes"
          @filterChange="handleFilterChange"
          @priceChange="handlePriceChange"
        />

        <!-- Индикатор загрузки -->
        <div v-if="isLoading" class="loading-placeholder desktop-filters">
          <div class="loading-spinner"></div>
          <p>Загрузка фильтров...</p>
        </div>

        <div class="category-content">
          <!-- Индикатор фильтрации -->
          <div v-if="isFiltering" class="filtering-overlay">
            <div class="filtering-spinner"></div>
            <p>Применяем фильтры...</p>
          </div>
          
          <div class="results-info">
            <div class="results-header">
              <p>Найдено товаров: {{ filteredProducts.length }}</p>
              <button 
                class="sort-button" 
                @click="handleSortByPrice"
                :class="{ 
                  'sort-active': sortDirection !== 'none'
                }"
                :disabled="isFiltering"
              >
                <span>Цена</span>
                <transition name="sort-icon">
                  <img 
                    v-show="sortDirection !== 'none'"
                    :src="getImageUrl('/src/assets/sort.svg')" 
                    :class="['sort-icon', { 'rotated': sortDirection === 'asc' }]"
                    alt="Сортировка"
                  />
                </transition>
              </button>
            </div>
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
          :products="sortedProducts"
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
            
            <!-- Активные фильтры в модальном окне -->
            <div v-if="getActiveFilters.length > 0" class="filters-modal-active">
              <div class="active-filters-mobile">
                <div class="filter-tags-mobile">
                  <div 
                    v-for="filter in getActiveFilters" 
                    :key="`${filter.type}-${filter.value}`"
                    class="filter-tag-mobile"
                  >
                    <span class="filter-tag-text">{{ filter.label }}</span>
                    <button 
                      class="filter-tag-remove"
                      @click="removeFilter(filter.type, filter.value)"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="filters-modal-content">
              <CategorySide 
                v-if="!isLoading"
                :selectedFilters="selectedFilters"
                :priceRange="priceRange"
                :brands="categoryBrands"
                :showOSFilter="showOSFilter"
                :categoryOS="categoryOS"
                :showResolutionFilter="showResolutionFilter"
                :categoryResolution="categoryResolution"
                :showRefreshRateFilter="showRefreshRateFilter"
                :categoryRefreshRate="categoryRefreshRate"
                :showMemoryFilter="showMemoryFilter"
                :showRamFilter="showRamFilter"
                :showProcessorFilter="showProcessorFilter"
                :categoryProcessors="categoryProcessors"
                :showGpuFilter="showGpuFilter"
                :categoryGpu="categoryGpu"
                :showDiagonalFilter="showDiagonalFilter"
                :categoryDiagonal="categoryDiagonal"
                :showTypeFilter="showTypeFilter"
                :categoryTypes="categoryTypes"
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

.loading-placeholder {
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e0e0e0;
    border-top: 3px solid #750DC5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Адаптивные стили для спиннера
@media (max-width: 768px) {
  .filtering-overlay {
    padding-top: 80px;
    
    .filtering-spinner {
      width: 35px;
      height: 35px;
    }
    
    p {
      font-size: 13px;
    }
  }
}

@media (max-width: 480px) {
  .filtering-overlay {
    padding-top: 60px;
    
    .filtering-spinner {
      width: 30px;
      height: 30px;
    }
    
    p {
      font-size: 12px;
    }
  }
}

.category-content {
  flex: 1;
  position: relative;
}

.filtering-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 300px;
  z-index: 10;
  border-radius: 8px;
  
  .filtering-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f0f0f0;
    border-top: 3px solid #750DC5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
    font-weight: 500;
  }
}

.results-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
}

.sort-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #750DC5;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      background-color: white;
      border-color: #ddd;
    }
  }
  
  .sort-icon {
    width: 16px;
    height: 16px;
    transition: all 0.3s ease;
    filter: brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0.8) contrast(1);
    opacity: 1;
    transform: scale(1);
  }
  
  &.sort-active {
    border-color: #750DC5;
  }
  
  .sort-icon.rotated {
    transform: rotate(180deg) scale(1);
  }
  
  // Анимации для v-show
  .sort-icon-enter-active,
  .sort-icon-leave-active {
    transition: all 0.3s ease;
  }
  
  .sort-icon-enter-from {
    opacity: 0;
    transform: scale(0.8);
  }
  
  .sort-icon-leave-to {
    opacity: 0;
    transform: scale(0.8);
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
  
  .filters-modal-active {
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    background-color: #f8f9fa;
    
    .active-filters-mobile {
      .filter-tags-mobile {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .filter-tag-mobile {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background-color: #750DC5;
          color: white;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          
          .filter-tag-text {
            white-space: nowrap;
          }
          
          .filter-tag-remove {
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            padding: 2px;
            cursor: pointer;
            border-radius: 50%;
            transition: background-color 0.2s ease;
            
            &:hover {
              background-color: rgba(255, 255, 255, 0.2);
            }
            
            svg {
              width: 10px;
              height: 10px;
              color: white;
            }
          }
        }
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

// Адаптивные стили для средних экранов (1200px-1400px)
@media (max-width: 1400px) and (min-width: 901px) {
  .main.container {
    padding: 0 20px;
  }
  
  .category-page {
    gap: 16px;
  }
  
  .category-content {
    min-width: 0; // Позволяет контенту сжиматься
  }
}

// Адаптивные стили для малых экранов (900px-1200px)
@media (max-width: 1200px) and (min-width: 901px) {
  .main.container {
    padding: 0 16px;
  }
  
  .category-page {
    gap: 12px;
  }
  
  .results-info {
    padding: 8px;
    
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
}

// Адаптивные стили - только для мобильных устройств
@media (max-width: 900px) {
  .main.container {
    padding: 0 16px;
    padding-bottom: 80px; // Отступ от мобильной навигации
  }
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
  
  .results-info {
    .results-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
  }
  
  .sort-button {
    align-self: flex-start;
  }
}

@media (max-width: 600px) {
  
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
    
    .filters-modal-active {
      padding: 12px 16px;
      
      .active-filters-mobile {
        .filter-tags-mobile {
          gap: 6px;
          
          .filter-tag-mobile {
            padding: 5px 8px;
            font-size: 11px;
            
            .filter-tag-remove {
              svg {
                width: 8px;
                height: 8px;
              }
            }
          }
        }
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