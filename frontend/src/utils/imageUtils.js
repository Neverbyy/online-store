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
import laptop1 from '../assets/laptop1.png'
import laptop2 from '../assets/laptop2.png'
import laptop3 from '../assets/laptop3.png'
import laptop4 from '../assets/laptop4.png'
import laptop5 from '../assets/laptop5.png'
import laptop6 from '../assets/laptop6.png'
import laptop7 from '../assets/laptop7.png'
import laptop8 from '../assets/laptop8.png'
import macbook from '../assets/macbook.png'
import macbook1 from '../assets/macbook1.png'
import macbook2 from '../assets/macbook2.png'
import macbook3 from '../assets/macbook3.png'
import macbook4 from '../assets/macbook4.png'
import phone from '../assets/phone.png'
import tablet1 from '../assets/tablet1.png'
import tablet2 from '../assets/tablet2.png'
import tablet3 from '../assets/tablet3.png'
import tablet4 from '../assets/tablet4.png'
import tablet5 from '../assets/tablet5.png'
import tablet6 from '../assets/tablet6.png'
import tablet7 from '../assets/tablet7.png'
import tablet8 from '../assets/tablet8.png'
import tablet9 from '../assets/tablet9.png'
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
import error404 from '../assets/404.png'

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
  '/src/assets/laptop1.png': laptop1,
  '/src/assets/laptop2.png': laptop2,
  '/src/assets/laptop3.png': laptop3,
  '/src/assets/laptop4.png': laptop4,
  '/src/assets/laptop5.png': laptop5,
  '/src/assets/laptop6.png': laptop6,
  '/src/assets/laptop7.png': laptop7,
  '/src/assets/laptop8.png': laptop8,
  '/src/assets/macbook.png': macbook,
  '/src/assets/macbook1.png': macbook1,
  '/src/assets/macbook2.png': macbook2,
  '/src/assets/macbook3.png': macbook3,
  '/src/assets/macbook4.png': macbook4,
  '/src/assets/phone.png': phone,
  '/src/assets/tablet1.png': tablet1,
  '/src/assets/tablet2.png': tablet2,
  '/src/assets/tablet3.png': tablet3,
  '/src/assets/tablet4.png': tablet4,
  '/src/assets/tablet5.png': tablet5,
  '/src/assets/tablet6.png': tablet6,
  '/src/assets/tablet7.png': tablet7,
  '/src/assets/tablet8.png': tablet8,
  '/src/assets/tablet9.png': tablet9,
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
  '/src/assets/404.png': error404,
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