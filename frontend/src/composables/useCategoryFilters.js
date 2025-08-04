import { ref, computed } from 'vue';

export const useCategoryFilters = (items, category) => {
  // Состояние фильтров
  const selectedFilters = ref({
    brand: [],
    memory: [],
    ram: [],
    sale: [],
    os: [],
    resolution: [],
    refreshRate: [],
    processor: [],
    gpu: [],
    diagonal: [],
    type: []
  });
  
  const priceRange = ref([0, 300000]); // Диапазон цен

  // Утилитарные функции для оптимизации
  const getFilteredItems = () => {
    if (!items.value || !Array.isArray(items.value)) return [];
    return items.value.filter(item => item.category === category.value);
  };

  const createCategoryOptions = (featureKey, transformValue = (value) => value) => {
    const filtered = getFilteredItems();
    const optionsMap = new Map();
    
    filtered.forEach(item => {
      const value = item.features?.[featureKey];
      if (value) {
        const normalizedValue = value.trim().toLowerCase();
        const originalValue = value.trim();
        optionsMap.set(normalizedValue, transformValue(originalValue));
      }
    });
    
    return Array.from(optionsMap.entries()).map(([key, label]) => ({
      label: label,
      value: key
    }));
  };

  const hasFeature = (featureKey) => {
    const filtered = getFilteredItems();
    return filtered.some(item => item.features && item.features[featureKey]);
  };

  // Универсальная функция фильтрации по характеристикам
  const applyFeatureFilter = (items, filterValues, featureKey, comparisonType = 'includes') => {
    if (filterValues.length === 0) return items;
    
    return items.filter(item => {
      const featureValue = item.features?.[featureKey];
      if (!featureValue) return false;
      
      const normalizedFeatureValue = featureValue.trim().toLowerCase();
      
      return filterValues.some(filter => {
        const normalizedFilter = filter.toLowerCase();
        
        switch (comparisonType) {
          case 'exact':
            return normalizedFeatureValue === normalizedFilter;
          case 'memory':
            // Специальная обработка для памяти - извлекаем размер из строки
            const extractMemorySize = (text) => {
              // Ищем паттерн: число + пробел + GB/ГБ (с возможными дополнительными символами)
              const match = text.match(/(\d+)\s*(gb|гб)/i);
              return match ? `${match[1]}gb` : null;
            };
            
            const itemMemorySize = extractMemorySize(normalizedFeatureValue);
            const filterMemorySize = extractMemorySize(normalizedFilter);
            
            // Если удалось извлечь размеры, сравниваем их
            if (itemMemorySize && filterMemorySize) {
              return itemMemorySize === filterMemorySize;
            }
            
            // Fallback: обычное сравнение
            const normalizedMemoryValue = normalizedFeatureValue.replace(/\s+/g, ' ');
            const normalizedMemoryFilter = normalizedFilter.replace(/gb$/, ' gb');
            return normalizedMemoryValue === normalizedMemoryFilter;
          case 'diagonal':
            // Специальная обработка для диагонали - извлекаем число из строки
            const extractDiagonalSize = (text) => {
              // Ищем паттерн: число + дюйм (с возможными дополнительными символами)
              const match = text.match(/(\d+)\s*[""]/i);
              return match ? `${match[1]}"` : null;
            };
            
            const itemDiagonalSize = extractDiagonalSize(normalizedFeatureValue);
            const filterDiagonalSize = extractDiagonalSize(normalizedFilter);
            
            // Если удалось извлечь размеры, сравниваем их
            if (itemDiagonalSize && filterDiagonalSize) {
              return itemDiagonalSize === filterDiagonalSize;
            }
            
            // Fallback: обычное сравнение
            return normalizedFeatureValue.includes(normalizedFilter);
          case 'type':
            // Специальная обработка для типа товара - извлекаем основной тип из названия
            const extractProductType = (text) => {
              const normalizedText = text.toLowerCase();
              
              // Определяем основные типы аудиотехники
              if (normalizedText.includes('наушники')) {
                return 'наушники';
              } else if (normalizedText.includes('колонки') || normalizedText.includes('динамики') || normalizedText.includes('колонка')) {
                return 'колонки';
              } else if (normalizedText.includes('сабвуфер')) {
                return 'сабвуфер';
              } else if (normalizedText.includes('микрофон')) {
                return 'микрофон';
              } else if (normalizedText.includes('усилитель')) {
                return 'усилитель';
              } else if (normalizedText.includes('ресивер')) {
                return 'ресивер';
              } else if (normalizedText.includes('плеер')) {
                return 'плеер';
              }
              
              return normalizedText;
            };
            
            const itemType = extractProductType(normalizedFeatureValue);
            const filterType = extractProductType(normalizedFilter);
            
            return itemType === filterType;
          case 'includes':
          default:
            return normalizedFeatureValue.includes(normalizedFilter);
        }
      });
    });
  };

  // Фильтрация товаров по категории и выбранным фильтрам
  const filteredProducts = computed(() => {
    let filtered = getFilteredItems();
    
    // Фильтрация по цене
    filtered = filtered.filter(item => {
      const price = parseInt(item.price.replace(/\s/g, ''));
      return price >= priceRange.value[0] && price <= priceRange.value[1];
    });
    
    // Фильтрация по бренду
    if (selectedFilters.value.brand.length > 0) {
      filtered = filtered.filter(item => 
        selectedFilters.value.brand.includes(item.brand.toLowerCase())
      );
    }
    
    // Фильтрация по памяти
    filtered = applyFeatureFilter(filtered, selectedFilters.value.memory, 'Встроенная память', 'memory');
    
    // Фильтрация по оперативной памяти
    filtered = applyFeatureFilter(filtered, selectedFilters.value.ram, 'Оперативная память', 'memory');
    
    // Фильтрация по акциям
    if (selectedFilters.value.sale.length > 0) {
      filtered = filtered.filter(item => item.isSale === true);
    }
    
    // Фильтрация по операционной системе
    filtered = applyFeatureFilter(filtered, selectedFilters.value.os, 'Операционная система', 'includes');
    
    // Фильтрация по разрешению
    filtered = applyFeatureFilter(filtered, selectedFilters.value.resolution, 'Разрешение', 'includes');
    
    // Фильтрация по частоте обновления
    filtered = applyFeatureFilter(filtered, selectedFilters.value.refreshRate, 'Частота обновления', 'includes');
    
    // Фильтрация по процессору
    filtered = applyFeatureFilter(filtered, selectedFilters.value.processor, 'Процессор', 'includes');
    
    // Фильтрация по видеокарте
    filtered = applyFeatureFilter(filtered, selectedFilters.value.gpu, 'Видеокарта', 'includes');
    
    // Фильтрация по диагонали
    filtered = applyFeatureFilter(filtered, selectedFilters.value.diagonal, 'Диагональ', 'diagonal');
    
    // Фильтрация по типу
    filtered = applyFeatureFilter(filtered, selectedFilters.value.type, 'Тип', 'type');
    
    return filtered;
  });

  // Бренды для текущей категории
  const categoryBrands = computed(() => {
    const filtered = getFilteredItems();
    const brandsSet = new Set(filtered.map(item => item.brand));
    return Array.from(brandsSet).map(b => ({
      label: b.charAt(0).toUpperCase() + b.slice(1),
      value: b.toLowerCase()
    }));
  });

  // Собираем операционные системы для текущей категории
  const categoryOS = computed(() => createCategoryOptions('Операционная система'));

  // Проверяем, нужно ли показывать фильтр ОС для текущей категории
  const showOSFilter = computed(() => {
    // Показываем фильтр только если у товаров есть операционная система
    return categoryOS.value.length > 0;
  });

  // Собираем разрешения для текущей категории
  const categoryResolution = computed(() => createCategoryOptions('Разрешение'));

  // Собираем частоты обновления для текущей категории
  const categoryRefreshRate = computed(() => createCategoryOptions('Частота обновления'));

  // Собираем процессоры для текущей категории
  const categoryProcessors = computed(() => createCategoryOptions('Процессор'));

  // Собираем видеокарты для текущей категории
  const categoryGpu = computed(() => createCategoryOptions('Видеокарта'));

  // Собираем диагонали для текущей категории
  const categoryDiagonal = computed(() => {
    const filtered = getFilteredItems();
    const diagonalMap = new Map();
    
    filtered.forEach(item => {
      const diagonalValue = item.features?.['Диагональ'];
      if (diagonalValue) {
        // Извлекаем размер диагонали из строки
        const match = diagonalValue.match(/(\d+)\s*[""]/i);
        if (match) {
          const diagonalSize = `${match[1]}"`;
          diagonalMap.set(diagonalSize, diagonalSize);
        }
      }
    });
    
    return Array.from(diagonalMap.entries()).map(([key, label]) => ({
      label: label,
      value: key
    })).sort((a, b) => {
      // Сортируем по размеру диагонали (числовое сравнение)
      const sizeA = parseInt(a.value);
      const sizeB = parseInt(b.value);
      return sizeA - sizeB;
    });
  });

  // Собираем типы товаров для текущей категории
  const categoryTypes = computed(() => {
    const filtered = getFilteredItems();
    const typeMap = new Map();
    
    filtered.forEach(item => {
      const typeValue = item.features?.['Тип'];
      if (typeValue) {
        // Извлекаем основной тип из названия
        const extractProductType = (text) => {
          const normalizedText = text.toLowerCase();
          
          if (normalizedText.includes('наушники')) {
            return 'наушники';
          } else if (normalizedText.includes('колонки') || normalizedText.includes('динамики') || normalizedText.includes('колонка')) {
            return 'колонки';
          } else if (normalizedText.includes('сабвуфер')) {
            return 'сабвуфер';
          } else if (normalizedText.includes('микрофон')) {
            return 'микрофон';
          } else if (normalizedText.includes('усилитель')) {
            return 'усилитель';
          } else if (normalizedText.includes('ресивер')) {
            return 'ресивер';
          } else if (normalizedText.includes('плеер')) {
            return 'плеер';
          }
          
          return normalizedText;
        };
        
        const mainType = extractProductType(typeValue);
        const displayName = getTypeDisplayName(mainType);
        typeMap.set(mainType, displayName);
      }
    });
    
    return Array.from(typeMap.entries()).map(([key, label]) => ({
      label: label,
      value: key
    })).sort((a, b) => a.label.localeCompare(b.label, 'ru'));
  });

  // Проверяем, нужно ли показывать фильтр разрешения для текущей категории
  const showResolutionFilter = computed(() => categoryResolution.value.length > 0);

  // Проверяем, нужно ли показывать фильтр частоты обновления для текущей категории
  const showRefreshRateFilter = computed(() => categoryRefreshRate.value.length > 0);

  // Проверяем, нужно ли показывать фильтр встроенной памяти для текущей категории
  const showMemoryFilter = computed(() => hasFeature('Встроенная память'));

  // Проверяем, нужно ли показывать фильтр оперативной памяти для текущей категории
  const showRamFilter = computed(() => hasFeature('Оперативная память'));

  // Проверяем, нужно ли показывать фильтр процессора для текущей категории
  const showProcessorFilter = computed(() => hasFeature('Процессор'));

  // Проверяем, нужно ли показывать фильтр видеокарты для текущей категории
  const showGpuFilter = computed(() => hasFeature('Видеокарта'));

  // Проверяем, нужно ли показывать фильтр диагонали для текущей категории
  const showDiagonalFilter = computed(() => hasFeature('Диагональ'));

  // Проверяем, нужно ли показывать фильтр типа для текущей категории
  const showTypeFilter = computed(() => hasFeature('Тип'));

  // Функция для получения отображаемого названия типа
  const getTypeDisplayName = (type) => {
    const typeNames = {
      'наушники': 'Наушники',
      'колонки': 'Колонки',
      'сабвуфер': 'Сабвуфер',
      'микрофон': 'Микрофоны',
      'усилитель': 'Усилитель',
      'ресивер': 'Ресивер',
      'плеер': 'Плеер'
    };
    
    return typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Обработчики фильтров
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

  // Получение названий фильтров
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
        '32GB': '32 ГБ',
        '16GB': '16 ГБ',
        '8GB': '8 ГБ',
        '4GB': '4 ГБ',
        '2GB': '2 ГБ'
      },
      sale: {
        'sale': 'Скидки и предложения'
      },
      os: {
        'ios 17': 'iOS 17',
        'ios 15': 'iOS 15', 
        'ios 14': 'iOS 14',
        'android 14': 'Android 14',
        'android 13': 'Android 13',
        'macos': 'macOS',
        'macos sonoma': 'macOS Sonoma',
        'windows 11 pro': 'Windows 11 Pro',
        'windows 11': 'Windows 11',
        'windows 10': 'Windows 10',
        'hyperos': 'HyperOS',
        'oxygenos 14': 'OxygenOS 14',
        'ipados 17': 'iPadOS 17',
        'watchos 10': 'watchOS 10',
        'wear os': 'Wear OS'
      },
      resolution: {
        '4k uhd': '4K UHD',
        '4k 60p': '4K 60p'
      },
      refreshRate: {
        '120 гц': '120 Гц',
        '60 гц': '60 Гц'
      },
      processor: {
        'a17 pro': 'A17 Pro',
        'a15 bionic': 'A15 Bionic',
        'a14 bionic': 'A14 Bionic',
        'apple m1': 'Apple M1',
        'apple m2': 'Apple M2',
        'apple m3 pro': 'Apple M3 Pro',
        'intel core i7': 'Intel Core i7',
        'intel core i5': 'Intel Core i5',
        'amd ryzen 5': 'AMD Ryzen 5',
        'amd ryzen 7 6800h': 'AMD Ryzen 7 6800H',
        'intel core i7-1355u': 'Intel Core i7-1355U',
        'intel core i7-1360p': 'Intel Core i7-1360P',
        'intel core i5-13400f': 'Intel Core i5-13400F',
        'intel core i7-13700k': 'Intel Core i7-13700K',
        'snapdragon 8 gen 3': 'Snapdragon 8 Gen 3',
        'snapdragon 8 gen 2': 'Snapdragon 8 Gen 2',
        'google tensor g3': 'Google Tensor G3',
        'exynos w930': 'Exynos W930',
        'apple s9': 'Apple S9'
      },
      gpu: {
        'apple gpu': 'Apple GPU',
        'adreno 740': 'Adreno 740',
        'adreno 730': 'Adreno 730',
        'mali-g610': 'Mali-G610',
        'mali-g78': 'Mali-G78',
        'powervr gx6450': 'PowerVR GX6450',
        'nvidia geforce rtx 4060': 'NVIDIA GeForce RTX 4060',
        'nvidia geforce rtx 4070': 'NVIDIA GeForce RTX 4070',
        'nvidia geforce rtx 4080': 'NVIDIA GeForce RTX 4080',
        'nvidia geforce rtx 4090': 'NVIDIA GeForce RTX 4090',
        'amd radeon rx 7600': 'AMD Radeon RX 7600',
        'amd radeon rx 7700': 'AMD Radeon RX 7700',
        'intel uhd graphics': 'Intel UHD Graphics',
        'intel iris xe graphics': 'Intel Iris Xe Graphics'
      },
      diagonal: {
        '55"': '55"',
        '65"': '65"',
        '75"': '75"',
        '85"': '85"',
        '32"': '32"',
        '43"': '43"',
        '50"': '50"',
        '58"': '58"',
        '70"': '70"',
        '77"': '77"',
        '83"': '83"'
      },
      type: {
        'наушники': 'Наушники',
        'колонки': 'Колонки',
        'сабвуфер': 'Сабвуфер',
        'микрофон': 'Микрофоны',
        'усилитель': 'Усилитель',
        'ресивер': 'Ресивер',
        'плеер': 'Плеер'
      }
    };
    
    return filterConfigs[filterType]?.[value] || value;
  };

  // Активные фильтры для отображения
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

  return {
    // Состояние
    selectedFilters,
    priceRange,
    
    // Computed свойства
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
    
    // Методы
    handleFilterChange,
    handlePriceChange,
    removeFilter,
    getFilterLabel
  };
}; 