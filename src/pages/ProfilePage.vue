<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ProfileSection from '../components/ProfileSection.vue';

const store = useStore();

// Получаем текущее активное состояние из Vuex Store
const activeItem = computed(() => store.state.profile.activeItem);

// Массив пунктов меню
const menuItems = [
    'Настройка профиля',
    'Заказы',
    'Мои адреса',
    'Обратная связь'
];

// Метод для установки активного элемента
const setActiveItem = (index) => {
    store.dispatch('profile/setActiveItem', index);
};

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

</style>
