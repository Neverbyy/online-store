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
    processor: []
  });
  
  const priceRange = ref([0, 300000]); // Диапазон цен по умолчанию

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
        const memoryValue = item.features['Встроенная память'];
        if (!memoryValue) return false;
        
        // Нормализуем значение из API (убираем лишние пробелы, приводим к нижнему регистру)
        const normalizedMemoryValue = memoryValue.trim().toLowerCase().replace(/\s+/g, ' ');
        
        return selectedFilters.value.memory.some(filter => {
          // Нормализуем значение фильтра (добавляем пробел перед GB если его нет)
          const normalizedFilter = filter.toLowerCase().replace(/gb$/, ' gb');
          return normalizedMemoryValue === normalizedFilter;
        });
      });
    }
    
    // Фильтрация по оперативной памяти (если есть в features)
    if (selectedFilters.value.ram.length > 0) {
      filtered = filtered.filter(item => {
        const ramValue = item.features['Оперативная память'];
        if (!ramValue) return false;
        
        // Нормализуем значение из API (убираем лишние пробелы, приводим к нижнему регистру)
        const normalizedRamValue = ramValue.trim().toLowerCase().replace(/\s+/g, ' ');
        
        return selectedFilters.value.ram.some(filter => {
          // Нормализуем значение фильтра (добавляем пробел перед GB если его нет)
          const normalizedFilter = filter.toLowerCase().replace(/gb$/, ' gb');
          return normalizedRamValue === normalizedFilter;
        });
      });
    }
    
    // Фильтрация по акциям
    if (selectedFilters.value.sale.length > 0) {
      filtered = filtered.filter(item => item.isSale === true);
    }
    
    // Фильтрация по операционной системе
    if (selectedFilters.value.os.length > 0) {
      filtered = filtered.filter(item => {
        const osValue = item.features['Операционная система'];
        return selectedFilters.value.os.some(filter => 
          osValue && osValue.toLowerCase().includes(filter.toLowerCase())
        );
      });
    }
    
    // Фильтрация по разрешению
    if (selectedFilters.value.resolution.length > 0) {
      filtered = filtered.filter(item => {
        const resolutionValue = item.features['Разрешение'];
        return selectedFilters.value.resolution.some(filter => 
          resolutionValue && resolutionValue.toLowerCase().includes(filter.toLowerCase())
        );
      });
    }
    
    // Фильтрация по частоте обновления
    if (selectedFilters.value.refreshRate.length > 0) {
      filtered = filtered.filter(item => {
        const refreshRateValue = item.features['Частота обновления'];
        return selectedFilters.value.refreshRate.some(filter => 
          refreshRateValue && refreshRateValue.toLowerCase().includes(filter.toLowerCase())
        );
      });
    }
    
    // Фильтрация по процессору
    if (selectedFilters.value.processor.length > 0) {
      filtered = filtered.filter(item => {
        const processorValue = item.features['Процессор'];
        if (!processorValue) return false;
        
        // Нормализуем значение из API (убираем лишние пробелы, приводим к нижнему регистру)
        const normalizedProcessorValue = processorValue.trim().toLowerCase();
        
        return selectedFilters.value.processor.some(filter => {
          // Нормализуем значение фильтра
          const normalizedFilter = filter.toLowerCase();
          return normalizedProcessorValue.includes(normalizedFilter);
        });
      });
    }
    
    return filtered;
  });

  // Бренды для текущей категории
  const categoryBrands = computed(() => {
    const filtered = items.value.filter(item => item.category === category.value);
    const brandsSet = new Set(filtered.map(item => item.brand));
    return Array.from(brandsSet).map(b => ({
      label: b.charAt(0).toUpperCase() + b.slice(1),
      value: b.toLowerCase()
    }));
  });

  // Собираем операционные системы для текущей категории
  const categoryOS = computed(() => {
    const filtered = items.value.filter(item => item.category === category.value);
    const osMap = new Map(); // Используем Map для сохранения оригинального значения
    
    filtered.forEach(item => {
      const osValue = item.features['Операционная система'];
      if (osValue) {
        // Нормализуем значение для сравнения (убираем лишние пробелы, приводим к нижнему регистру)
        const normalizedValue = osValue.trim().toLowerCase();
        // Сохраняем оригинальное значение как label
        osMap.set(normalizedValue, osValue.trim());
      }
    });
    
    return Array.from(osMap.entries()).map(([key, label]) => ({
      label: label,
      value: key
    }));
  });

  // Проверяем, нужно ли показывать фильтр ОС для текущей категории
  const showOSFilter = computed(() => {
    // Показываем фильтр только если у товаров есть операционная система
    return categoryOS.value.length > 0;
  });

  // Собираем разрешения для текущей категории
  const categoryResolution = computed(() => {
    const filtered = items.value.filter(item => item.category === category.value);
    const resolutionMap = new Map(); // Используем Map для сохранения оригинального значения
    
    filtered.forEach(item => {
      const resolutionValue = item.features['Разрешение'];
      if (resolutionValue) {
        // Нормализуем значение для сравнения (убираем лишние пробелы, приводим к нижнему регистру)
        const normalizedValue = resolutionValue.trim().toLowerCase();
        // Сохраняем оригинальное значение как label
        resolutionMap.set(normalizedValue, resolutionValue.trim());
      }
    });
    
    return Array.from(resolutionMap.entries()).map(([key, label]) => ({
      label: label,
      value: key
    }));
  });

  // Собираем частоты обновления для текущей категории
  const categoryRefreshRate = computed(() => {
    const filtered = items.value.filter(item => item.category === category.value);
    const refreshRateMap = new Map(); // Используем Map для сохранения оригинального значения
    
    filtered.forEach(item => {
      const refreshRateValue = item.features['Частота обновления'];
      if (refreshRateValue) {
        // Нормализуем значение для сравнения (убираем лишние пробелы, приводим к нижнему регистру)
        const normalizedValue = refreshRateValue.trim().toLowerCase();
        // Сохраняем оригинальное значение как label
        refreshRateMap.set(normalizedValue, refreshRateValue.trim());
      }
    });
    
    return Array.from(refreshRateMap.entries()).map(([key, label]) => ({
      label: label,
      value: key
    }));
  });

  // Собираем процессоры для текущей категории
  const categoryProcessors = computed(() => {
    const filtered = items.value.filter(item => item.category === category.value);
    const processorMap = new Map(); // Используем Map для сохранения оригинального значения
    
    filtered.forEach(item => {
      const processorValue = item.features['Процессор'];
      if (processorValue) {
        // Нормализуем значение для сравнения (убираем лишние пробелы, приводим к нижнему регистру)
        const normalizedValue = processorValue.trim().toLowerCase();
        // Сохраняем оригинальное значение как label
        processorMap.set(normalizedValue, processorValue.trim());
      }
    });
    
    return Array.from(processorMap.entries()).map(([key, label]) => ({
      label: label,
      value: key
    }));
  });

  // Проверяем, нужно ли показывать фильтр разрешения для текущей категории
  const showResolutionFilter = computed(() => {
    return categoryResolution.value.length > 0;
  });

  // Проверяем, нужно ли показывать фильтр частоты обновления для текущей категории
  const showRefreshRateFilter = computed(() => {
    return categoryRefreshRate.value.length > 0;
  });

  // Проверяем, нужно ли показывать фильтр встроенной памяти для текущей категории
  const showMemoryFilter = computed(() => {
    const filtered = items.value.filter(item => item.category === category.value);
    return filtered.some(item => item.features && item.features['Встроенная память']);
  });

  // Проверяем, нужно ли показывать фильтр оперативной памяти для текущей категории
  const showRamFilter = computed(() => {
    const filtered = items.value.filter(item => item.category === category.value);
    return filtered.some(item => item.features && item.features['Оперативная память']);
  });

  // Проверяем, нужно ли показывать фильтр процессора для текущей категории
  const showProcessorFilter = computed(() => {
    const filtered = items.value.filter(item => item.category === category.value);
    return filtered.some(item => item.features && item.features['Процессор']);
  });

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
    getActiveFilters,
    
    // Методы
    handleFilterChange,
    handlePriceChange,
    removeFilter,
    getFilterLabel
  };
}; 