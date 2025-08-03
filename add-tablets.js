const axios = require('axios');

const laptops = [
  {
    id: 48,
    name: "Apple AirPods Pro",
    image: "/src/assets/aud1.png",
    category: "Audio",
    price: "24 990",
    brand: "Apple",
    features: {
      "Тип": "Беспроводные наушники",
      "Время работы": "4.5 часа",
      "Шумоподавление": "Активное",
      "Зарядка": "Lightning"
    }
  },
  {
    id: 49,
    name: "Sony WH-1000XM4",
    image: "/src/assets/aud2.png",
    category: "Audio",
    price: "34 990",
    brand: "Sony",
    features: {
      "Тип": "Беспроводные наушники",
      "Время работы": "30 часов",
      "Шумоподавление": "Активное",
      "Зарядка": "USB-C"
    }
  },
  {
    id: 50,
    name: "JBL Flip 6",
    image: "/src/assets/audio3.png",
    category: "Audio",
    price: "11 990",
    brand: "JBL",
    features: {
      "Тип": "Bluetooth колонка",
      "Мощность": "30 Вт",
      "Водонепроницаемость": "IPX7",
      "Время работы": "12 часов"
    }
  },
  {
    id: 51,
    name: "Bose SoundLink",
    image: "/src/assets/aud1.png",
    category: "Audio",
    price: "44 990",
    brand: "Bose",
    features: {
      "Тип": "Домашняя акустика",
      "Мощность": "50 Вт",
      "Подключение": "Bluetooth/AUX",
      "Время работы": "8 часов"
    }
  },
  {
    id: 52,
    name: "Blue Yeti",
    image: "/src/assets/aud2.png",
    category: "Audio",
    price: "17 990",
    brand: "Blue",
    features: {
      "Тип": "USB микрофон",
      "Диафрагма": "Конденсаторная",
      "Частотный диапазон": "20Hz-20kHz",
      "Чувствительность": "-46 dB"
    }
  },
  {
    id: 53,
    name: "Shure SM58",
    image: "/src/assets/audio3.png",
    category: "Audio",
    price: "14 990",
    brand: "Shure",
    features: {
      "Тип": "Динамический микрофон",
      "Подключение": "XLR",
      "Частотный диапазон": "50Hz-15kHz",
      "Чувствительность": "-54.5 dB"
    }
  },
  {
    id: 54,
    name: "Razer Kraken",
    image: "/src/assets/aud1.png",
    category: "Audio",
    price: "7 990",
    brand: "Razer",
    features: {
      "Тип": "Игровые наушники",
      "Подключение": "3.5mm/USB",
      "Микрофон": "Выдвижной",
      "Частотный диапазон": "12Hz-28kHz"
    }
  },
  {
    id: 55,
    name: "Anker Soundcore",
    image: "/src/assets/aud2.png",
    category: "Audio",
    price: "4 990",
    brand: "Anker",
    features: {
      "Тип": "Портативная колонка",
      "Мощность": "16 Вт",
      "Водонепроницаемость": "IPX5",
      "Время работы": "24 часа"
    }
  }
];

// Новые поля для добавления к существующим товарам
const additionalFields = {
  "additionalImages": [
    "/src/assets/laptop1.png",
    "/src/assets/laptop2.png", 
    "/src/assets/laptop3.png"
  ],
  "description": "Мощный игровой ноутбук для требовательных игр и работы",
  "inStock": true,
  "rating": 4.8,
  "reviewsCount": 127
};

const addLaptops = async () => {
  console.log('🎵 Начинаю добавление аудиотехники...');
  
  for (const item of laptops) {
    try {
      // Добавляем новый товар с помощью POST запроса
      const response = await axios.post('https://48e8b1c201ae4e29.mokky.dev/items', item);
      console.log(`✅ Добавлен товар: ${item.name} (${item.price} ₽) с ID: ${response.data.id}`);
    } catch (error) {
      console.error(`❌ Ошибка при добавлении товара ${item.name}:`, error.message);
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🎵 Добавление аудиотехники завершено!');
  console.log('Проверьте результат: https://48e8b1c201ae4e29.mokky.dev/items');
};
// Новые поля для features товара с ID = 25
const additionalFeatures = {
  "Тип": "Наушники",
};

// Массив товаров для обновления изображений
const itemsToUpdateImages = [
  {
    id: 48,
    name: "Apple AirPods Pro",
    brand: "Xiaomi",
  }
];

// Массив товаров для добавления additionalImages
const itemsToAddAdditionalImages = [
  {
    id: 2,
    additionalImages: [
      "/src/assets/pc1-1.png",
      "/src/assets/pc1-2.png",
      "/src/assets/pc1-3.png"
    ]
  },
  {
    id: 5,
    additionalImages: [
      "/src/assets/pc2-1.png",
      "/src/assets/pc2-2.png",
      "/src/assets/pc2-3.png"
    ]
  },
  {
    id: 9,
    additionalImages: [
      "/src/assets/pc3-1.png",
      "/src/assets/pc3-2.png",
      "/src/assets/pc3-3.png"
    ]
  },
  {
    id: 16,
    additionalImages: [
      "/src/assets/pc4-1.png",
      "/src/assets/pc4-2.png",
      "/src/assets/pc4-3.png"
    ]
  },
  {
    id: 19,
    additionalImages: [
      "/src/assets/pc5-1.png",
      "/src/assets/pc5-2.png",
      "/src/assets/pc5-3.png"
    ]
  }
];



// Функция для обновления существующих товаров
const updateExistingItems = async () => {
  console.log('Начинаю обновление существующих товаров...');
  
  try {
    // Сначала получаем список всех товаров
    const response = await axios.get('https://48e8b1c201ae4e29.mokky.dev/items');
    const items = response.data;
    
    console.log(`Найдено ${items.length} товаров для обновления`);
    
    // Обновляем каждый товар
    for (const item of items) {
      try {
        // Объединяем существующие данные с новыми полями
        const updatedItem = {
          ...item,
          ...additionalFields
        };
        
        // Используем PATCH для полного обновления товара
        await axios.patch(`https://48e8b1c201ae4e29.mokky.dev/items/${item.id}`, updatedItem);
        console.log(`✅ Обновлен товар: ${item.name} (ID: ${item.id})`);
        
      } catch (error) {
        console.error(`❌ Ошибка при обновлении ${item.name} (ID: ${item.id}):`, error.message);
      }
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('Обновление завершено!');
    
  } catch (error) {
    console.error('❌ Ошибка при получении списка товаров:', error.message);
  }
};

// Функция для частичного обновления (только новые поля)
const patchExistingItems = async () => {
  console.log('Начинаю частичное обновление товаров...');
  
  try {
    const response = await axios.get('https://48e8b1c201ae4e29.mokky.dev/items');
    const items = response.data;
    
    console.log(`Найдено ${items.length} товаров для частичного обновления`);
    
    for (const item of items) {
      try {
        // Используем PATCH для частичного обновления
        await axios.patch(`https://48e8b1c201ae4e29.mokky.dev/items/${item.id}`, additionalFields);
        console.log(`✅ Частично обновлен товар: ${item.name} (ID: ${item.id})`);
        
      } catch (error) {
        console.error(`❌ Ошибка при частичном обновлении ${item.name} (ID: ${item.id}):`, error.message);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('Частичное обновление завершено!');
    
  } catch (error) {
    console.error('❌ Ошибка при получении списка товаров:', error.message);
  }
};

// Функция для поиска товара по названию
const findItemByName = async (itemName) => {
  console.log(`🔍 Ищем товар: "${itemName}"`);
  
  try {
    const response = await axios.get('https://48e8b1c201ae4e29.mokky.dev/items');
    const items = response.data;
    
    const foundItem = items.find(item => 
      item.name.toLowerCase().replace(/\s+/g, ' ').trim() === 
      itemName.toLowerCase().replace(/\s+/g, ' ').trim()
    );
    
    if (foundItem) {
      console.log(`✅ Найден товар:`);
      console.log(`   ID: ${foundItem.id}`);
      console.log(`   Название: ${foundItem.name}`);
      console.log(`   Категория: ${foundItem.category}`);
      console.log(`   Features:`, foundItem.features);
      return foundItem;
    } else {
      console.log(`❌ Товар "${itemName}" не найден`);
      console.log('Доступные товары:');
      items.forEach(item => {
        console.log(`   ID: ${item.id} - ${item.name}`);
      });
      return null;
    }
    
  } catch (error) {
    console.error('❌ Ошибка при поиске товара:', error.message);
    return null;
  }
};

// Функция для обновления товара по ID
const updateItemById = async (itemId) => {
  console.log(`🔄 Начинаю обновление товара с ID = ${itemId}`);
  
  try {
    // Получаем товар по ID
    const response = await axios.get(`https://48e8b1c201ae4e29.mokky.dev/items/${itemId}`);
    const item = response.data;
    
    console.log(`✅ Найден товар: ${item.name}`);
    console.log('Текущие features:', item.features);
    
    // Объединяем существующие features с новыми
    const updatedFeatures = {
      ...item.features,
      ...additionalFeatures
    };
    
    // Создаем обновленный объект товара
    const updatedItem = {
      ...item,
      features: updatedFeatures
    };
    
    // Обновляем товар
    await axios.patch(`https://48e8b1c201ae4e29.mokky.dev/items/${itemId}`, updatedItem);
    console.log('✅ Товар успешно обновлен!');
    console.log('Новые features:', updatedFeatures);
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении товара:', error.message);
  }
};

// Функция для обновления конкретного товара по названию (для обратной совместимости)
const updateSpecificItem = async () => {
  const itemName = "Смартфон Xiaomi Redmi 128GB";
  console.log(`🔄 Начинаю поиск и обновление товара: "${itemName}"`);
  
  try {
    // Сначала найдем товар
    const item = await findItemByName(itemName);
    
    if (!item) {
      console.log('❌ Товар не найден, обновление невозможно');
      return;
    }
    
    console.log(`📝 Обновляем товар с ID = ${item.id}...`);
    
    // Объединяем существующие features с новыми
    const updatedFeatures = {
      ...item.features,
      ...additionalFeatures
    };
    
    // Создаем обновленный объект товара
    const updatedItem = {
      ...item,
      features: updatedFeatures
    };
    
    // Обновляем товар (используем PATCH вместо PUT)
    await axios.patch(`https://48e8b1c201ae4e29.mokky.dev/items/${item.id}`, updatedItem);
    console.log('✅ Товар успешно обновлен!');
    console.log('Новые features:', updatedFeatures);
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении товара:', error.message);
  }
};

// Функция для обновления изображений нескольких товаров
const updateImagesForItems = async () => {
  console.log('🖼️ Начинаю обновление изображений для товаров...');
  
  for (const itemUpdate of itemsToUpdateImages) {
    try {
      // Получаем текущий товар
      const response = await axios.get(`https://48e8b1c201ae4e29.mokky.dev/items/${itemUpdate.id}`);
      const currentItem = response.data;
      
      console.log(`📸 Обновляем изображение для: ${currentItem.name} (ID: ${itemUpdate.id})`);
      console.log(`   Старое изображение: ${currentItem.image}`);
      console.log(`   Новое изображение: ${itemUpdate.newImage}`);
      
      // Обновляем только поле image
      const updatedItem = {
        ...currentItem,
        image: itemUpdate.newImage
      };
      
      // Отправляем PATCH запрос для обновления
      await axios.patch(`https://48e8b1c201ae4e29.mokky.dev/items/${itemUpdate.id}`, updatedItem);
      console.log(`✅ Изображение обновлено для: ${currentItem.name}`);
      
    } catch (error) {
      console.error(`❌ Ошибка при обновлении изображения для товара ID ${itemUpdate.id}:`, error.message);
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('🖼️ Обновление изображений завершено!');
  console.log('Проверьте результат: https://48e8b1c201ae4e29.mokky.dev/items');
};

// Функция для добавления additionalImages к конкретным товарам
const addAdditionalImagesToItems = async () => {
  console.log('🖼️ Начинаю добавление additionalImages для товаров...');
  
  for (const itemUpdate of itemsToAddAdditionalImages) {
    try {
      // Получаем текущий товар
      const response = await axios.get(`https://48e8b1c201ae4e29.mokky.dev/items/${itemUpdate.id}`);
      const currentItem = response.data;
      
      console.log(`📸 Добавляем additionalImages для: ${currentItem.name} (ID: ${itemUpdate.id})`);
      console.log(`   Количество изображений: ${itemUpdate.additionalImages.length}`);
      console.log(`   Изображения: ${itemUpdate.additionalImages.join(', ')}`);
      
      // Добавляем поле additionalImages к существующим данным
      const updatedItem = {
        ...currentItem,
        additionalImages: itemUpdate.additionalImages
      };
      
      // Отправляем PATCH запрос для обновления
      await axios.patch(`https://48e8b1c201ae4e29.mokky.dev/items/${itemUpdate.id}`, updatedItem);
      console.log(`✅ AdditionalImages добавлены для: ${currentItem.name}`);
      
    } catch (error) {
      console.error(`❌ Ошибка при добавлении additionalImages для товара ID ${itemUpdate.id}:`, error.message);
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('🖼️ Добавление additionalImages завершено!');
  console.log('Проверьте результат: https://48e8b1c201ae4e29.mokky.dev/items');
};

// Функция для поиска товара Xiaomi
const findXiaomiItem = async () => {
  console.log('🔍 Ищем товар Xiaomi...');
  
  try {
    const response = await axios.get('https://48e8b1c201ae4e29.mokky.dev/items');
    const items = response.data;
    
    // Ищем товары с "Xiaomi" в названии
    const xiaomiItems = items.filter(item => 
      item.name.toLowerCase().includes('xiaomi') || 
      item.name.toLowerCase().includes('redmi')
    );
    
    if (xiaomiItems.length > 0) {
      console.log(`✅ Найдено ${xiaomiItems.length} товаров Xiaomi:`);
      xiaomiItems.forEach(item => {
        console.log(`   ID: ${item.id} - ${item.name}`);
        console.log(`   Features:`, item.features);
        console.log('   ---');
      });
    } else {
      console.log('❌ Товары Xiaomi не найдены');
      console.log('Все товары:');
      items.forEach(item => {
        console.log(`   ID: ${item.id} - ${item.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Ошибка при поиске:', error.message);
  }
};

// Функция для выбора действия
const selectAction = () => {
  console.log('🚀 Выберите действие:');
  console.log('1. Добавить новую аудиотехнику');
  console.log('2. Полное обновление всех товаров (добавить дополнительные поля)');
  console.log('3. Частичное обновление всех товаров (только новые поля)');
  console.log('4. Обновить конкретный товар (Xiaomi Redmi)');
  console.log('5. Найти товары Xiaomi');
  console.log('6. Обновить товар по ID');
  console.log('7. Обновить изображения для нескольких товаров');
  console.log('8. Добавить additionalImages к конкретным товарам');
  console.log('9. Выход');
  
  // Получаем аргументы командной строки
  const action = process.argv[2];
  const itemId = process.argv[3];
  
  switch(action) {
    case '1':
      console.log('🎵 Добавляем новую аудиотехнику...');
addLaptops(); 
      break;
    case '2':
      console.log('🔄 Полное обновление всех товаров...');
      updateExistingItems();
      break;
    case '3':
      console.log('🔧 Частичное обновление всех товаров...');
      patchExistingItems();
      break;
    case '4':
      console.log('📱 Обновляем Xiaomi Redmi...');
      updateSpecificItem();
      break;
    case '5':
      console.log('🔍 Ищем товары Xiaomi...');
      findXiaomiItem();
      break;
    case '6':
      if (itemId) {
        console.log(`🔧 Обновляем товар с ID = ${itemId}...`);
        updateItemById(parseInt(itemId));
      } else {
        console.log('❌ Укажите ID товара!');
        console.log('Пример: node add-tablets.js 6 15');
      }
      break;
    case '7':
      console.log('🖼️ Обновляем изображения для товаров...');
      updateImagesForItems();
      break;
    case '8':
      console.log('🖼️ Добавляем additionalImages к товарам...');
      addAdditionalImagesToItems();
      break;
    case '9':
      console.log('👋 Выход');
      break;
    default:
      console.log('❌ Неверный выбор. Используйте:');
      console.log('   node add-tablets.js 1 - Добавить новую аудиотехнику');
      console.log('   node add-tablets.js 2 - Полное обновление');
      console.log('   node add-tablets.js 3 - Частичное обновление');
      console.log('   node add-tablets.js 4 - Обновить Xiaomi');
      console.log('   node add-tablets.js 5 - Найти Xiaomi');
      console.log('   node add-tablets.js 6 <ID> - Обновить товар по ID');
      console.log('   node add-tablets.js 7 - Обновить изображения');
      console.log('   node add-tablets.js 8 - Добавить additionalImages');
      console.log('   node add-tablets.js 9 - Выход');
      console.log('');
      console.log('Примеры:');
      console.log('   node add-tablets.js 6 15 - Обновить товар с ID = 15');
      console.log('   node add-tablets.js 6 25 - Обновить товар с ID = 25');
  }
};

// Запускаем выбор действия
selectAction(); 