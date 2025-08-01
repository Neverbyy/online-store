<template>
  <div class="not-found-page">

    <!-- Основной контент -->
    <main class="main-content">
      <h2 class="error-title">Страница не найдена</h2>
      
      <!-- Иллюстрация -->
      <div class="error-illustration">
        <img :src="error404Image" alt="404 Error" class="error-image" />
      </div>

      <!-- Текст с инструкциями -->
      <div class="error-text">
        <p>Неправильно набран адрес или такой страницы не существует</p>
      </div>

      <!-- Кнопка на главную -->
      <router-link to="/">
        <div class="cart-btn">
            <ButtonCart> На главную</ButtonCart>
        </div>
        </router-link>
    </main>
  </div>
</template>

<script setup>
import { getImageUrl } from '../utils/imageUtils'
import ButtonCart from '../components/UI/buttonCart.vue';

const error404Image = getImageUrl('/src/assets/404.png')

</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}

.header {
  margin-bottom: 30px;
  
  .logo {
    font-size: 32px;
    font-weight: 700;
    color: #750DC5;
    text-align: center;
    margin: 0;
    letter-spacing: 2px;
    text-shadow: 0 2px 4px rgba(117, 13, 197, 0.1);
  }
}

.search-section {
  width: 100%;
  max-width: 600px;
  margin-bottom: 40px;
  
  .search-bar {
    position: relative;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    border: 1px solid #e0e0e0;
    
    .search-icon {
      color: #666;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 16px;
      color: #333;
      outline: none;
      
      &::placeholder {
        color: #999;
      }
    }
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-title {
  font-size: 32px;
  font-weight: 800;
  color: #333;
  margin: 0 0 30px 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.error-illustration {
  margin-bottom: 30px;
  
  .error-image {
    width: 500px;
    height: auto;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }
}

.error-text {
  margin-bottom: 40px;
  
  p {
    font-size: 18px;
    color: #666;
    margin: 0;
    line-height: 1.6;
    font-weight: 400;
    max-width: 400px;
    
    &:first-child {
      margin-bottom: 8px;
    }
  }
}

.home-button {
  background-color: #750DC5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(117, 13, 197, 0.3);
  
  &:hover {
    background-color: #6a0bb8;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(117, 13, 197, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .home-icon {
    flex-shrink: 0;
  }
}

// Адаптивность для мобильных устройств
@media (max-width: 600px) {
  .not-found-page {
    padding: 16px;
  }
  
  .header .logo {
    font-size: 28px;
  }
  
  .search-section {
    margin-bottom: 30px;
    
    .search-bar {
      padding: 10px 14px;
      
      .search-input {
        font-size: 14px;
      }
    }
  }
  
  .error-title {
    font-size: 28px;
    margin-bottom: 25px;
  }
  
  .error-illustration .error-image {
    max-width: 400px;
  }
  
  .error-text {
    margin-bottom: 30px;
    
    p {
      font-size: 16px;
      max-width: 320px;
    }
  }
  
  .home-button {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>