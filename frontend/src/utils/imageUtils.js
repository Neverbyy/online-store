// Импортируем все изображения из assets
import iphone1 from '../assets/iphone1.png'
import iphone2 from '../assets/iphone2.png'
import iphone3 from '../assets/iphone3.png'
import iphone4 from '../assets/iphone4.png'
import iphone5 from '../assets/iphone5.png'
import pc1 from '../assets/pc1.png'
import pc2 from '../assets/pc2.png'
import pc3 from '../assets/pc3.png'
import pc4 from '../assets/pc4.png'
import laptop from '../assets/laptop.png'
import macbook from '../assets/macbook.png'
import phone from '../assets/phone.png'
import tablet1 from '../assets/tablet1.png'
import tablet2 from '../assets/tablet2.png'
import tablet3 from '../assets/tablet3.png'
import tv1 from '../assets/tv1.png'
import tv2 from '../assets/tv2.png'
import tv3 from '../assets/tv3.png'
import aud1 from '../assets/aud1.png'
import aud2 from '../assets/aud2.png'
import audio3 from '../assets/audio3.png'
import cam1 from '../assets/cam1.png'
import cam2 from '../assets/cam2.png'
import camera3 from '../assets/camera3.png'
import console1 from '../assets/console1.png'
import console2 from '../assets/console2.png'
import console3 from '../assets/console3.png'
import watch1 from '../assets/watch1.png'
import watch2 from '../assets/watch2.png'
import watch3 from '../assets/watch3.png'
import slide1 from '../assets/slide1.png'
import slide2 from '../assets/slide2.png'
import slide3 from '../assets/slide3.png'
import slide4 from '../assets/slide4.png'
import cart from '../assets/cart.png'
import add from '../assets/add.png'
import remove from '../assets/remove.png'

// Маппинг путей к импортированным изображениям
const imageMap = {
  '/src/assets/iphone1.png': iphone1,
  '/src/assets/iphone2.png': iphone2,
  '/src/assets/iphone3.png': iphone3,
  '/src/assets/iphone4.png': iphone4,
  '/src/assets/iphone5.png': iphone5,
  '/src/assets/pc1.png': pc1,
  '/src/assets/pc2.png': pc2,
  '/src/assets/pc3.png': pc3,
  '/src/assets/pc4.png': pc4,
  '/src/assets/laptop.png': laptop,
  '/src/assets/macbook.png': macbook,
  '/src/assets/phone.png': phone,
  '/src/assets/tablet1.png': tablet1,
  '/src/assets/tablet2.png': tablet2,
  '/src/assets/tablet3.png': tablet3,
  '/src/assets/tv1.png': tv1,
  '/src/assets/tv2.png': tv2,
  '/src/assets/tv3.png': tv3,
  '/src/assets/aud1.png': aud1,
  '/src/assets/aud2.png': aud2,
  '/src/assets/audio3.png': audio3,
  '/src/assets/cam1.png': cam1,
  '/src/assets/cam2.png': cam2,
  '/src/assets/camera3.png': camera3,
  '/src/assets/console1.png': console1,
  '/src/assets/console2.png': console2,
  '/src/assets/console3.png': console3,
  '/src/assets/watch1.png': watch1,
  '/src/assets/watch2.png': watch2,
  '/src/assets/watch3.png': watch3,
  '/src/assets/slide1.png': slide1,
  '/src/assets/slide2.png': slide2,
  '/src/assets/slide3.png': slide3,
  '/src/assets/slide4.png': slide4,
  '/src/assets/cart.png': cart,
  '/src/assets/add.png': add,
  '/src/assets/remove.png': remove,
}

/**
 * Получает правильный URL изображения для продакшена
 * @param {string} imagePath - путь к изображению из API
 * @returns {string} - правильный URL изображения
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  
  // Если путь уже правильный (начинается с http или https), возвращаем как есть
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Если путь в нашем маппинге, возвращаем импортированное изображение
  if (imageMap[imagePath]) {
    return imageMap[imagePath]
  }
  
  // Если путь не найден, возвращаем заглушку или пустую строку
  console.warn(`Изображение не найдено: ${imagePath}`)
  return ''
}

/**
 * Получает URL изображения для CSS (background-image)
 * @param {string} imagePath - путь к изображению из API
 * @returns {string} - правильный URL для CSS
 */
export const getImageUrlForCSS = (imagePath) => {
  const url = getImageUrl(imagePath)
  return url ? `url(${url})` : 'none'
} 