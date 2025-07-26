<script setup>
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import ProfileSection from '../components/ProfileSection.vue';
import { useRouter } from 'vue-router';

const store = useStore();

// Получаем текущее активное состояние из Vuex Store
const activeItem = computed(() => store.state.profile.activeItem);

// Массив пунктов меню
const menuItems = [
    'Настройка профиля',
    'Заказы',
    'Мои адреса',
    'Мои отзывы'
];

// Метод для установки активного элемента
const setActiveItem = (index) => {
    store.dispatch('profile/setActiveItem', index);
};

const router = useRouter();
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

watch(isAuthenticated, (newVal) => {
  if (!newVal) {
    router.push({ name: 'Home' });
  }
});

onMounted(() => {
    store.dispatch('auth/checkUserExists');
});

</script>

<template>
    <div class="main container">
        <h1>Личный кабинет</h1>
        <div class="profile__page">
            <div class="sidebar profile-block">
                <aside>
                    <ul class="sidebar-menu">
                        <li 
                            v-for="(item, index) in menuItems" 
                            :key="index" 
                            :class="{'sidebar-item': true, 'active': activeItem === index}" 
                            @click="setActiveItem(index)"
                        >
                            <span>{{ item }}</span>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class="main__content profile-block">
                <ProfileSection/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profile__page {
    display: flex;
    justify-content: space-between;
    gap: 90px;
}

.main__content {
    width: 100%;
}

.sidebar {
    width: 400px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;

    &-menu {
        display: flex;
        flex-direction: column;
        padding: 8px;
    }

    &-item {
        cursor: pointer;
        padding: 12px 16px;
        border-radius: 6px;
        font-size: 17px;
        font-weight: 500;
        color: #374151;
        transition: all 0.2s ease;
        margin-bottom: 2px;
        border: 1px solid transparent;

        &:hover {
            background-color: #f8f9fa;
            color: #1f2937;
            border-color: #e5e7eb;
        }

        &.active {
            background-color: #750DC5;
            color: #ffffff;
            font-weight: 600;
            border-color: #750DC5;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
}

.profile-block {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: 24px;
    border: 1px solid #e5e7eb;
}

@media (max-width: 900px) {
  .profile__page {
    flex-direction: row;
    gap: 24px;
    padding: 0 20px;
  }
  
  .sidebar {
    width: 280px;
    flex-shrink: 0;
  }
  
  .main__content {
    flex: 1;
  }
  
  .profile-block {
    padding: 16px;
  }
  
  .sidebar-item {
    font-size: 15px;
    padding: 10px 12px;
  }
  
  .main {
    padding-bottom: 80px;

    h1{
        margin-left: 20px;
    }
  }
}

@media (max-width: 600px) {
  .profile__page {
    flex-direction: column;
    gap: 16px;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
    padding: 8px;
    gap: 8px;
  }
  
  .sidebar-item {
    white-space: nowrap;
    font-size: 14px;
    padding: 8px 12px;
    margin-bottom: 0;
  }
  
  .profile-block {
    padding: 12px;
  }
}
</style>
