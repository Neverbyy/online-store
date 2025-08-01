const axios = require('axios');

const laptops = [
  {
    "id": 46,
    "name": "ASUS ROG Strix G16",
    "image": "/src/assets/img1.png",
    "category": "Laptops",
    "price": "249 990",
    "brand": "ASUS",
    "features": {
      "Процессор": "Intel Core i9-13900H",
      "Оперативная память": "32 GB DDR5",
      "Видеокарта": "NVIDIA GeForce RTX 4080",
      "Объем SSD": "2 TB NVMe",
      "Дисплей": "16\" 240Hz QHD",
      "Операционная система": "Windows 11 Pro"
    }
  },
  {
    "id": 47,
    "name": "Lenovo Legion Pro 7",
    "image": "/src/assets/img3.png",
    "category": "Laptops",
    "price": "189 990",
    "brand": "Lenovo",
    "isSale": true,
    "oldPrice": "219 990",
    "features": {
      "Процессор": "AMD Ryzen 7 7745H",
      "Оперативная память": "16 GB DDR5",
      "Видеокарта": "NVIDIA GeForce RTX 4070",
      "Объем SSD": "1 TB NVMe",
      "Дисплей": "16\" 165Hz QHD",
      "Операционная система": "Windows 11"
    }
  },
  {
    "id": 48,
    "name": "MSI Raider GE78 HX",
    "image": "/src/assets/img1.png",
    "category": "Laptops",
    "price": "229 990",
    "brand": "MSI",
    "features": {
      "Процессор": "Intel Core i7-13700HX",
      "Оперативная память": "32 GB DDR5",
      "Видеокарта": "NVIDIA GeForce RTX 4070 Ti",
      "Объем SSD": "2 TB NVMe",
      "Дисплей": "17\" 240Hz QHD",
      "Операционная система": "Windows 11 Pro"
    }
  },
  {
    "id": 49,
    "name": "Acer Predator Helios 16",
    "image": "/src/assets/img3.png",
    "category": "Laptops",
    "price": "149 990",
    "brand": "Acer",
    "isSale": true,
    "oldPrice": "179 990",
    "features": {
      "Процессор": "Intel Core i7-13700H",
      "Оперативная память": "16 GB DDR5",
      "Видеокарта": "NVIDIA GeForce RTX 4060",
      "Объем SSD": "1 TB NVMe",
      "Дисплей": "16\" 165Hz QHD",
      "Операционная система": "Windows 11"
    }
  },
  {
    "id": 50,
    "name": "HP Omen 17",
    "image": "/src/assets/img1.png",
    "category": "Laptops",
    "price": "129 990",
    "brand": "HP",
    "features": {
      "Процессор": "Intel Core i7-13620H",
      "Оперативная память": "16 GB DDR5",
      "Видеокарта": "NVIDIA GeForce RTX 4060",
      "Объем SSD": "1 TB NVMe",
      "Дисплей": "17.3\" 144Hz FHD",
      "Операционная система": "Windows 11"
    }
  }
];

const addLaptops = async () => {
  console.log('Начинаю добавление игровых ноутбуков...');
  
  for (const laptop of laptops) {
    try {
      const response = await axios.post('https://48e8b1c201ae4e29.mokky.dev/items', laptop);
      console.log(`✅ Добавлен: ${laptop.name}`);
    } catch (error) {
      console.error(`❌ Ошибка при добавлении ${laptop.name}:`, error.message);
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('Завершено! Проверьте результат: https://48e8b1c201ae4e29.mokky.dev/items');
};

addLaptops(); 