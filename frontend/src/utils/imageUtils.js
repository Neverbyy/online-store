// Автоматический импорт всех изображений из папки assets
const pngImages = import.meta.glob('../assets/*.png', { eager: true })
const svgImages = import.meta.glob('../assets/*.svg', { eager: true })

// Объединяем все изображения
const allImages = { ...pngImages, ...svgImages }

// Создание маппинга автоматически
const imageMap = Object.fromEntries(
  Object.entries(allImages).map(([path, module]) => [
    path.replace('../assets/', '/src/assets/'),
    module.default
  ])
)

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

/**
 * Получает список всех доступных изображений (для отладки)
 * @returns {string[]} - массив путей к изображениям
 */
export const getAvailableImages = () => {
  return Object.keys(imageMap)
}